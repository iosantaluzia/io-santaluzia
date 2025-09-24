import { useState, useEffect, useCallback } from 'react';

interface PrivateMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface OnlineUser {
  username: string;
  lastSeen: Date;
  isOnline: boolean;
}

interface ChatSystemState {
  onlineUsers: OnlineUser[];
  privateMessages: PrivateMessage[];
  activeChat: string | null;
}

const ONLINE_THRESHOLD = 5 * 60 * 1000; // 5 minutes
const MESSAGE_RETENTION_DAYS = 3;

export function useChatSystem(currentUser: string) {
  const [state, setState] = useState<ChatSystemState>({
    onlineUsers: [],
    privateMessages: [],
    activeChat: null
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedOnlineUsers = localStorage.getItem('chat-online-users');
    const savedMessages = localStorage.getItem('chat-private-messages');

    if (savedOnlineUsers) {
      try {
        const users = JSON.parse(savedOnlineUsers).map((user: any) => ({
          ...user,
          lastSeen: new Date(user.lastSeen)
        }));
        setState(prev => ({ ...prev, onlineUsers: users }));
      } catch (error) {
        console.error('Error loading online users:', error);
      }
    }

    if (savedMessages) {
      try {
        const messages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setState(prev => ({ ...prev, privateMessages: messages }));
      } catch (error) {
        console.error('Error loading private messages:', error);
      }
    }
  }, []);

  // Update current user's online status
  const updateOnlineStatus = useCallback(() => {
    const now = new Date();
    setState(prev => {
      const updatedUsers = [...prev.onlineUsers];
      const currentUserIndex = updatedUsers.findIndex(u => u.username === currentUser);
      
      if (currentUserIndex >= 0) {
        updatedUsers[currentUserIndex] = {
          ...updatedUsers[currentUserIndex],
          lastSeen: now,
          isOnline: true
        };
      } else {
        updatedUsers.push({
          username: currentUser,
          lastSeen: now,
          isOnline: true
        });
      }

      // Update online status for all users
      const allUsers = ['matheus', 'fabiola', 'thauanne', 'beatriz'];
      allUsers.forEach(username => {
        if (username !== currentUser) {
          const userIndex = updatedUsers.findIndex(u => u.username === username);
          if (userIndex >= 0) {
            const timeDiff = now.getTime() - updatedUsers[userIndex].lastSeen.getTime();
            updatedUsers[userIndex].isOnline = timeDiff < ONLINE_THRESHOLD;
          } else {
            // Add other users as offline initially
            updatedUsers.push({
              username,
              lastSeen: new Date(now.getTime() - ONLINE_THRESHOLD - 1000),
              isOnline: false
            });
          }
        }
      });

      return { ...prev, onlineUsers: updatedUsers };
    });
  }, [currentUser]);

  // Update online status every minute
  useEffect(() => {
    updateOnlineStatus();
    const interval = setInterval(updateOnlineStatus, 60000); // Every minute
    return () => clearInterval(interval);
  }, [updateOnlineStatus]);

  // Save online users to localStorage
  useEffect(() => {
    if (state.onlineUsers.length > 0) {
      localStorage.setItem('chat-online-users', JSON.stringify(state.onlineUsers));
    }
  }, [state.onlineUsers]);

  // Clean old messages (older than 3 days)
  const cleanOldMessages = useCallback(() => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - MESSAGE_RETENTION_DAYS);

    setState(prev => {
      const filteredMessages = prev.privateMessages.filter(
        msg => msg.timestamp > threeDaysAgo
      );
      return { ...prev, privateMessages: filteredMessages };
    });
  }, []);

  // Clean old messages on mount and every hour
  useEffect(() => {
    cleanOldMessages();
    const interval = setInterval(cleanOldMessages, 60 * 60 * 1000); // Every hour
    return () => clearInterval(interval);
  }, [cleanOldMessages]);

  // Save private messages to localStorage
  useEffect(() => {
    if (state.privateMessages.length > 0) {
      localStorage.setItem('chat-private-messages', JSON.stringify(state.privateMessages));
    }
  }, [state.privateMessages]);

  // Send private message
  const sendPrivateMessage = useCallback((to: string, message: string) => {
    const newMessage: PrivateMessage = {
      id: Date.now().toString(),
      from: currentUser,
      to,
      message,
      timestamp: new Date(),
      read: false
    };

    setState(prev => ({
      ...prev,
      privateMessages: [...prev.privateMessages, newMessage]
    }));

    return newMessage;
  }, [currentUser]);

  // Get messages between two users
  const getMessagesBetween = useCallback((user1: string, user2: string) => {
    return state.privateMessages.filter(msg => 
      (msg.from === user1 && msg.to === user2) ||
      (msg.from === user2 && msg.to === user1)
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [state.privateMessages]);

  // Mark messages as read
  const markMessagesAsRead = useCallback((from: string) => {
    setState(prev => ({
      ...prev,
      privateMessages: prev.privateMessages.map(msg => 
        msg.from === from && msg.to === currentUser ? { ...msg, read: true } : msg
      )
    }));
  }, [currentUser]);

  // Get unread count for a user
  const getUnreadCount = useCallback((from: string) => {
    return state.privateMessages.filter(msg => 
      msg.from === from && msg.to === currentUser && !msg.read
    ).length;
  }, [state.privateMessages, currentUser]);

  // Get all conversations
  const getConversations = useCallback(() => {
    const conversations = new Map<string, {
      user: string;
      lastMessage: PrivateMessage | null;
      unreadCount: number;
    }>();

    state.privateMessages.forEach(msg => {
      const otherUser = msg.from === currentUser ? msg.to : msg.from;
      
      if (!conversations.has(otherUser)) {
        conversations.set(otherUser, {
          user: otherUser,
          lastMessage: null,
          unreadCount: 0
        });
      }

      const conv = conversations.get(otherUser)!;
      
      if (!conv.lastMessage || msg.timestamp > conv.lastMessage.timestamp) {
        conv.lastMessage = msg;
      }

      if (msg.from === otherUser && msg.to === currentUser && !msg.read) {
        conv.unreadCount++;
      }
    });

    return Array.from(conversations.values()).sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
    });
  }, [state.privateMessages, currentUser]);

  return {
    onlineUsers: state.onlineUsers,
    privateMessages: state.privateMessages,
    activeChat: state.activeChat,
    setActiveChat: (user: string | null) => setState(prev => ({ ...prev, activeChat: user })),
    sendPrivateMessage,
    getMessagesBetween,
    markMessagesAsRead,
    getUnreadCount,
    getConversations,
    updateOnlineStatus
  };
}
