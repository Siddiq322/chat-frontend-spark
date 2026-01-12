import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { useChat } from "@/contexts/ChatContext";
import { getConversationMessages, getConversation } from "@/services/chatApi";
import { socketService } from "@/services/socketService";
import { useToast } from "@/hooks/use-toast";

interface Message {
  _id: string;
  conversation?: string;
  conversationId?: string;
  sender: {
    _id: string;
    username: string;
    email: string;
  };
  receiver?: string;
  content: string;
  type: "text" | "image" | "gif" | "sticker";
  status?: "sent" | "delivered" | "read";
  isDeleted?: boolean;
  createdAt: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    width?: number;
    height?: number;
  };
}

interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    isOnline?: boolean;
    lastSeen?: string;
  }>;
}

export default function Chat() {
  const { conversationId } = useParams();
  const { user } = useChat();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;

      try {
        setLoading(true);
        const [messagesRes, convoRes] = await Promise.all([
          getConversationMessages(conversationId),
          getConversation(conversationId)
        ]);

        if (messagesRes?.data) {
          const loadedMessages = messagesRes.data.messages || [];
          setMessages(loadedMessages);

          // Fallback: if no conversation info yet, infer other user from first message
          if (!otherUser && user && loadedMessages.length > 0) {
            const first = loadedMessages[0];
            const inferred = first.sender._id === user._id ? { _id: first.receiver } : first.sender;
            setOtherUser(inferred);
          }
        }

        const conversation: Conversation | undefined = convoRes?.data?.conversation;
        if (conversation && user) {
          const other = conversation.participants?.find(
            (p) => p._id !== user._id
          );
          setOtherUser(other);
        }
      } catch (error: any) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, user, toast]);

  // Listen for new messages
  useEffect(() => {
    // Handle messages received from others
    const handleReceivedMessage = (payload: any) => {
      const msg: Message = payload?.message || payload;
      const convId = msg.conversation || msg.conversationId || payload?.conversationId;
      if (convId === conversationId && msg.sender._id !== user?._id) {
        setMessages((prev) => [...prev, msg]);
        
        // Mark message as read immediately
        if (conversationId) {
          socketService.markMessageAsRead(conversationId);
        }
      }
    };

    // Handle messages sent by current user
    const handleSentMessage = (payload: any) => {
      const msg: Message = payload?.message || payload;
      const convId = msg.conversation || msg.conversationId || payload?.conversationId;
      if (convId === conversationId && msg.sender._id === user?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    // Handle message deletion
    const handleMessageDeleted = (payload: { messageId: string; conversationId: string }) => {
      if (payload.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === payload.messageId
              ? { ...msg, isDeleted: true, content: "This message was deleted" }
              : msg
          )
        );
      }
    };

    // Handle message status updates
    const handleStatusUpdate = (payload: { messageId: string; status: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === payload.messageId
            ? { ...msg, status: payload.status as "sent" | "delivered" | "read" }
            : msg
        )
      );
    };

    const offReceive = socketService.onReceiveMessage(handleReceivedMessage);
    const offSent = socketService.onMessageSent(handleSentMessage);
    const offDeleted = socketService.onMessageDeleted(handleMessageDeleted);
    const offStatus = socketService.onMessageStatusUpdated(handleStatusUpdate);

    return () => {
      offReceive?.();
      offSent?.();
      offDeleted?.();
      offStatus?.();
    };
  }, [conversationId, user?._id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) return;
    if (!otherUser?._id) {
      toast({ title: "Error", description: "User not found for this conversation", variant: "destructive" });
      return;
    }

    try {
      // Send via socket: receiverId, content, type, conversationId
      socketService.sendMessage(otherUser._id, content, "text", conversationId);
      // The real message will come via socket event; we avoid duplicate optimistic add
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      socketService.deleteMessage(messageId);
      toast({
        title: "Success",
        description: "Message deleted",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  // Helper to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInDays > 1) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (diffInHours > 1) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
  };

  if (!conversationId) {
    return (
      <div className="h-screen flex bg-background">
        <ChatSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Select a conversation to start chatting</p>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex bg-background">
        <ChatSidebar activeConversationId={conversationId} className="hidden md:flex" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading messages...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      <ChatSidebar activeConversationId={conversationId} className="hidden md:flex" />
      
      {/* Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          name={otherUser?.username || "Unknown User"}
          isOnline={otherUser?.isOnline || false}
          lastSeen={otherUser?.lastSeen}
        />
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 bg-secondary/10">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message._id}
                messageId={message._id}
                content={message.content}
                type={message.type}
                isOutgoing={user?._id === message.sender._id}
                timestamp={formatTimestamp(message.createdAt)}
                status={message.status || "sent"}
                isDeleted={message.isDeleted}
                onDelete={handleDeleteMessage}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <ChatInput onSend={handleSendMessage} />
      </main>
    </div>
  );
}
