/**
 * Chat API Service
 * All HTTP API calls to the backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper for authenticated requests
const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  return response.json();
};

// ============================================
// AUTHENTICATION
// ============================================

export const register = (username: string, email: string, password: string) =>
  authFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });

export const login = (email: string, password: string) =>
  authFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const getCurrentUser = () => authFetch('/auth/me');

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ============================================
// USERS
// ============================================

export const searchUsers = (query: string) =>
  authFetch(`/users/search?query=${encodeURIComponent(query)}`);

export const getUserProfile = (userId: string) =>
  authFetch(`/users/${userId}`);

export const updateProfile = (data: { username?: string; bio?: string }) =>
  authFetch('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const token = getToken();
  const response = await fetch(`${API_URL}/users/profile/picture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  return response.json();
};

export const changePassword = (currentPassword: string, newPassword: string) =>
  authFetch('/users/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

// ============================================
// CHAT REQUESTS
// ============================================

export const sendChatRequest = (receiverId: string, message = '') =>
  authFetch('/requests/send', {
    method: 'POST',
    body: JSON.stringify({ receiverId, message }),
  });

export const getReceivedRequests = () =>
  authFetch('/requests/received');

export const getSentRequests = () =>
  authFetch('/requests/sent');

export const acceptRequest = (requestId: string) =>
  authFetch(`/requests/${requestId}/accept`, { method: 'PUT' });

export const rejectRequest = (requestId: string) =>
  authFetch(`/requests/${requestId}/reject`, { method: 'PUT' });

// Aliases for compatibility
export const acceptChatRequest = acceptRequest;
export const rejectChatRequest = rejectRequest;
export const getChatRequests = getReceivedRequests;

// ============================================
// CONVERSATIONS
// ============================================

export const getConversations = () =>
  authFetch('/conversations');

export const getConversation = (conversationId: string) =>
  authFetch(`/conversations/${conversationId}`);

export const deleteConversation = (conversationId: string) =>
  authFetch(`/conversations/${conversationId}`, { method: 'DELETE' });

// ============================================
// MESSAGES
// ============================================

export const getMessages = (conversationId: string, page = 1, limit = 50) =>
  authFetch(`/messages/${conversationId}?page=${page}&limit=${limit}`);

// Alias for compatibility
export const getConversationMessages = (conversationId: string, page = 1, limit = 50) =>
  authFetch(`/messages/${conversationId}?page=${page}&limit=${limit}`);

export const markMessagesAsRead = (conversationId: string) =>
  authFetch(`/messages/${conversationId}/read`, { method: 'PUT' });

export const deleteMessage = (messageId: string) =>
  authFetch(`/messages/${messageId}`, { method: 'DELETE' });

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const token = getToken();
  const response = await fetch(`${API_URL}/messages/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  return response.json();
};
