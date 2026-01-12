import { useState, useEffect } from "react";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { Input } from "@/components/ui/input";
import { ChatListItem } from "./ChatListItem";
import { ChatRequestItem } from "./ChatRequestItem";
import { SearchUsersDialog } from "./SearchUsersDialog";
import { Search, Settings, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useChat } from "@/contexts/ChatContext";
import { getConversations, getChatRequests, acceptChatRequest, rejectChatRequest } from "@/services/chatApi";
import { useToast } from "@/hooks/use-toast";

interface ChatSidebarProps {
  activeConversationId?: string;
  className?: string;
}

export function ChatSidebar({ activeConversationId, className }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [chatRequests, setChatRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useChat();
  const { toast } = useToast();

  console.log('ChatSidebar - User:', user);

  // Fetch conversations and chat requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [convResponse, reqResponse] = await Promise.all([
          getConversations(),
          getChatRequests()
        ]);

        if (convResponse.success) {
          // Ensure data is an array
          const convData = Array.isArray(convResponse.data) 
            ? convResponse.data 
            : (convResponse.data?.conversations || []);
          setConversations(convData);
        }

        if (reqResponse.success) {
          // Ensure data is an array
          const reqData = Array.isArray(reqResponse.data) 
            ? reqResponse.data 
            : (reqResponse.data?.requests || []);
          setChatRequests(reqData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await acceptChatRequest(requestId);
      if (response.success) {
        setChatRequests(chatRequests.filter(req => req._id !== requestId));
        toast({
          title: "Success",
          description: "Chat request accepted!",
        });
        // Refresh conversations
        const convResponse = await getConversations();
        if (convResponse.success) {
          // Ensure data is an array
          const convData = Array.isArray(convResponse.data) 
            ? convResponse.data 
            : (convResponse.data?.conversations || []);
          setConversations(convData);
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to accept request",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Accept request error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to accept request",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await rejectChatRequest(requestId);
      if (response.success) {
        setChatRequests(chatRequests.filter(req => req._id !== requestId));
        toast({
          title: "Success",
          description: "Chat request rejected",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    }
  };

  // Show loading state if user not loaded yet
  if (!user) {
    return (
      <aside className={cn("w-full md:w-80 lg:w-96 bg-sidebar border-r flex flex-col h-full", className)}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground text-sm">
            Loading...
          </div>
        </div>
      </aside>
    );
  }

  const filteredConversations = conversations.filter((conv) => {
    // Backend returns 'participant' (singular) not 'participants'
    const otherUser = conv.participant || (conv.participants && conv.participants.find((p: any) => p?._id !== user?._id));
    return otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase() || '');
  });

  const formatTimestamp = (date: string) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffMs = now.getTime() - msgDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return msgDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return msgDate.toLocaleDateString('en-US', { weekday: 'short' });
    return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Show loading state if user not loaded yet
  if (!user) {
    return (
      <aside className={cn("w-full md:w-80 lg:w-96 bg-sidebar border-r flex flex-col h-full", className)}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground text-sm">
            Loading...
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "w-full md:w-80 lg:w-96 bg-sidebar border-r flex flex-col h-full",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AvatarWithStatus
              fallback={user?.username || "U"}
              isOnline={user?.isOnline || false}
              size="lg"
            />
            <div>
              <h2 className="font-semibold text-sm">{user?.username || "User"}</h2>
              <p className="text-xs text-muted-foreground">{user?.isOnline ? "Online" : "Offline"}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <SearchUsersDialog>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
                <MessageSquarePlus className="h-4 w-4" />
              </Button>
            </SearchUsersDialog>
            <Link to="/profile">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-9 h-10 rounded-full bg-secondary border-0"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Chat Requests */}
        {chatRequests.length > 0 && (
          <div className="p-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Chat Requests ({chatRequests.length})
            </h3>
            <div className="space-y-2">
              {chatRequests.map((request) => (
                <ChatRequestItem
                  key={request._id}
                  id={request._id}
                  name={request.sender.username}
                  avatar={request.sender.profilePicture}
                  onAccept={() => handleAcceptRequest(request._id)}
                  onReject={() => handleRejectRequest(request._id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Conversations */}
        <div className="p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Messages
          </h3>
          
          {loading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conv) => {
                // Backend returns 'participant' (singular)
                const otherUser = conv.participant || (conv.participants && conv.participants.find((p: any) => p._id !== user?._id));
                const unreadCount = conv.unreadCount || 0;
                
                return (
                  <ChatListItem
                    key={conv._id}
                    id={conv._id}
                    name={otherUser?.username || "Unknown"}
                    lastMessage={conv.lastMessage?.content || "No messages yet"}
                    timestamp={conv.lastMessage ? formatTimestamp(conv.lastMessage.createdAt) : ""}
                    unreadCount={unreadCount}
                    isOnline={otherUser?.isOnline || false}
                    isActive={activeConversationId === conv._id}
                    onClick={() => navigate(`/chat/${conv._id}`)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
