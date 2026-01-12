/**
 * Socket.IO Service
 * Real-time communication with backend
 */

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
const listeners = new Map();

// Use the same host as the API
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://127.0.0.1:5000';

// ============================================
// CONNECTION MANAGEMENT
// ============================================

export const connectSocket = (token: string) => {
  if (socket?.connected) return socket;
  
  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
    transports: ['websocket', 'polling']
  });
  
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
    // Re-attach all listeners on reconnect
    listeners.forEach((callback, event) => {
      socket?.off(event, callback);
      socket?.on(event, callback);
    });
  });
  
  socket.on('disconnect', (reason) => {
    console.log('⚠️ Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Server disconnected, reconnect manually
      socket?.connect();
    }
    // Otherwise, socket.io will auto-reconnect
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });
  
  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
  });
  
  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('🔄 Attempting to reconnect...', attemptNumber);
  });
  
  socket.on('reconnect_failed', () => {
    console.error('❌ Socket reconnection failed');
  });
  
  // Auto-attach event listeners
  listeners.forEach((callback, event) => {
    socket?.on(event, callback);
  });
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    listeners.clear();
  }
};

export const getSocket = () => socket;

// ============================================
// MESSAGE EVENTS
// ============================================

export const sendMessage = (
  receiverId: string, 
  content: string, 
  type: 'text' | 'image' | 'gif' | 'sticker' = 'text',
  conversationId: string | null = null,
  metadata = {}
) => {
  if (!socket) throw new Error('Socket not connected');
  
  socket.emit('send_message', {
    receiverId,
    content,
    type,
    conversationId,
    metadata
  });
};

export const onReceiveMessage = (callback: (data: any) => void) => {
  listeners.set('receive_message', callback);
  if (socket) socket.on('receive_message', callback);
  
  return () => {
    listeners.delete('receive_message');
    socket?.off('receive_message', callback);
  };
};

export const onMessageSent = (callback: (data: any) => void) => {
  listeners.set('message_sent', callback);
  if (socket) socket.on('message_sent', callback);
  
  return () => {
    listeners.delete('message_sent');
    socket?.off('message_sent', callback);
  };
};

export const onMessageError = (callback: (data: any) => void) => {
  listeners.set('message_error', callback);
  if (socket) socket.on('message_error', callback);
  
  return () => {
    listeners.delete('message_error');
    socket?.off('message_error', callback);
  };
};

// ============================================
// TYPING EVENTS
// ============================================

export const sendTyping = (receiverId: string, conversationId: string) => {
  if (!socket) return;
  socket.emit('typing', { receiverId, conversationId });
};

export const sendStopTyping = (receiverId: string, conversationId: string) => {
  if (!socket) return;
  socket.emit('stop_typing', { receiverId, conversationId });
};

export const onUserTyping = (callback: (data: any) => void) => {
  listeners.set('user_typing', callback);
  if (socket) socket.on('user_typing', callback);
  
  return () => {
    listeners.delete('user_typing');
    socket?.off('user_typing', callback);
  };
};

// ============================================
// STATUS EVENTS
// ============================================

export const onUserOnline = (callback: (data: any) => void) => {
  listeners.set('user_online', callback);
  if (socket) socket.on('user_online', callback);
  
  return () => {
    listeners.delete('user_online');
    socket?.off('user_online', callback);
  };
};

export const onUserOffline = (callback: (data: any) => void) => {
  listeners.set('user_offline', callback);
  if (socket) socket.on('user_offline', callback);
  
  return () => {
    listeners.delete('user_offline');
    socket?.off('user_offline', callback);
  };
};

// ============================================
// MESSAGE STATUS EVENTS
// ============================================

export const onMessageStatusUpdated = (callback: (data: any) => void) => {
  listeners.set('message_status_updated', callback);
  if (socket) socket.on('message_status_updated', callback);
  
  return () => {
    listeners.delete('message_status_updated');
    socket?.off('message_status_updated', callback);
  };
};

export const markMessageDelivered = (messageId: string) => {
  if (!socket) return;
  socket.emit('message_delivered', { messageId });
};

export const markMessageRead = (messageId: string) => {
  if (!socket) return;
  socket.emit('message_read', { messageId });
};

export const markMessageAsRead = (conversationId: string) => {
  if (!socket) return;
  socket.emit('message_read', { conversationId });
};

// ============================================
// MESSAGE DELETION
// ============================================

export const deleteMessage = (messageId: string) => {
  if (!socket) return;
  socket.emit('delete_message', { messageId });
};

export const onMessageDeleted = (callback: (data: any) => void) => {
  listeners.set('message_deleted', callback);
  if (socket) socket.on('message_deleted', callback);
  
  return () => {
    listeners.delete('message_deleted');
    socket?.off('message_deleted', callback);
  };
};

// ============================================
// CHAT REQUEST EVENTS
// ============================================

export const onRequestReceived = (callback: (data: any) => void) => {
  listeners.set('request_received', callback);
  if (socket) socket.on('request_received', callback);
  
  return () => {
    listeners.delete('request_received');
    socket?.off('request_received', callback);
  };
};

export const onRequestAccepted = (callback: (data: any) => void) => {
  listeners.set('request_accepted_notification', callback);
  if (socket) socket.on('request_accepted_notification', callback);
  
  return () => {
    listeners.delete('request_accepted_notification');
    socket?.off('request_accepted_notification', callback);
  };
};

export const notifyRequestSent = (receiverId: string, request: any) => {
  if (!socket) return;
  socket.emit('request_sent', { receiverId, request });
};

export const notifyRequestAccepted = (senderId: string, conversation: any) => {
  if (!socket) return;
  socket.emit('request_accepted', { senderId, conversation });
};

// Default export as object for easier importing
export const socketService = {
  connectSocket,
  disconnectSocket,
  getSocket,
  sendMessage,
  onReceiveMessage,
  onMessageSent,
  onMessageError,
  sendTyping,
  sendStopTyping,
  onUserTyping,
  onUserOnline,
  onUserOffline,
  onMessageStatusUpdated,
  markMessageDelivered,
  markMessageRead,
  markMessageAsRead,
  deleteMessage,
  onMessageDeleted,
  onRequestReceived,
  onRequestAccepted,
  notifyRequestSent,
  notifyRequestAccepted,
};

export default socketService;
