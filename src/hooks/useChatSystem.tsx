import { useState, useEffect, useCallback } from 'react';

interface ChatMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'group' | 'private';
}

interface OnlineUser {
  username: string;
  lastSeen: number;
  isOnline: boolean;
}

const STORAGE_KEYS = {
  MESSAGES: 'team-chat-messages',
  ONLINE_USERS: 'team-online-users',
  USER_ACTIVITY: 'team-user-activity'
};

const ONLINE_THRESHOLD = 2 * 60 * 1000; // 2 minutes
const MESSAGE_RETENTION_DAYS = 3;
const ALL_USERS = ['matheus', 'fabiola', 'thauanne', 'beatriz'];

export function useChatSystem(currentUser: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);

  // BroadcastChannel for real-time communication
  useEffect(() => {
    if (!currentUser) return;

    const channel = new BroadcastChannel('team-chat');
    
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'NEW_MESSAGE':
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === data.id);
            if (!exists) {
              // Check if this is a new message for the current user
              if (data.to === currentUser || data.type === 'group') {
                setNewMessageCount(prev => prev + 1);
              }
              return [...prev, data];
            }
            return prev;
          });
          break;
          
        case 'USER_ACTIVITY':
          updateUserActivity(data.username, data.timestamp);
          break;
          
        case 'SYNC_REQUEST':
          // Send current state to requesting tab
          channel.postMessage({
            type: 'SYNC_RESPONSE',
            data: {
              messages,
              onlineUsers,
              timestamp: Date.now()
            }
          });
          break;
          
        case 'SYNC_RESPONSE':
          if (data.timestamp > Date.now() - 1000) { // Only accept recent syncs
            setMessages(data.messages || []);
            setOnlineUsers(data.onlineUsers || []);
          }
          break;
          
        case 'CLEAR_NOTIFICATIONS':
          if (data.user === currentUser) {
            setNewMessageCount(0);
          }
          break;
      }
    };

    channel.addEventListener('message', handleMessage);
    
    // Request sync from other tabs
    channel.postMessage({ type: 'SYNC_REQUEST' });
    
    setIsConnected(true);

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
      setIsConnected(false);
    };
  }, [currentUser, messages, onlineUsers]);

  // Load initial data
  useEffect(() => {
    loadMessages();
    loadOnlineUsers();
    updateUserActivity();
  }, []);

  const loadMessages = useCallback(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Filter messages older than 3 days
        const threeDaysAgo = Date.now() - (MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000);
        const filteredMessages = parsedMessages.filter((msg: ChatMessage) => msg.timestamp > threeDaysAgo);
        
        setMessages(filteredMessages);
        
        // Clean up old messages
        if (filteredMessages.length !== parsedMessages.length) {
          localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(filteredMessages));
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  const loadOnlineUsers = useCallback(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEYS.ONLINE_USERS);
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        setOnlineUsers(parsedUsers);
      } else {
        // Initialize with all users offline
        const initialUsers = ALL_USERS.map(username => ({
          username,
          lastSeen: Date.now() - ONLINE_THRESHOLD - 1000,
          isOnline: false
        }));
        setOnlineUsers(initialUsers);
      }
    } catch (error) {
      console.error('Error loading online users:', error);
    }
  }, []);

  const updateUserActivity = useCallback((username?: string, timestamp?: number) => {
    const user = username || currentUser;
    const time = timestamp || Date.now();
    
    if (!user) return;

    setOnlineUsers(prev => {
      const updated = prev.map(u => 
        u.username === user 
          ? { ...u, lastSeen: time, isOnline: true }
          : { ...u, isOnline: (Date.now() - u.lastSeen) < ONLINE_THRESHOLD }
      );
      
      // Ensure all users are in the list
      ALL_USERS.forEach(username => {
        if (!updated.find(u => u.username === username)) {
          updated.push({
            username,
            lastSeen: Date.now() - ONLINE_THRESHOLD - 1000,
            isOnline: false
          });
        }
      });
      
      localStorage.setItem(STORAGE_KEYS.ONLINE_USERS, JSON.stringify(updated));
      return updated;
    });
  }, [currentUser]);

  // Update activity every 30 seconds
  useEffect(() => {
    if (!currentUser) return;

    updateUserActivity();
    const interval = setInterval(() => updateUserActivity(), 30000);
    
    return () => clearInterval(interval);
  }, [currentUser, updateUserActivity]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = useCallback((to: string, message: string, type: 'group' | 'private' = 'group') => {
    if (!currentUser || !message.trim()) return null;

    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: currentUser,
      to,
      message: message.trim(),
      timestamp: Date.now(),
      read: false,
      type
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Broadcast to other tabs
    const channel = new BroadcastChannel('team-chat');
    channel.postMessage({
      type: 'NEW_MESSAGE',
      data: newMessage
    });
    channel.close();

    return newMessage;
  }, [currentUser]);

  const getMessagesBetween = useCallback((user1: string, user2: string) => {
    return messages.filter(msg => 
      (msg.from === user1 && msg.to === user2) ||
      (msg.from === user2 && msg.to === user1)
    ).sort((a, b) => a.timestamp - b.timestamp);
  }, [messages]);

  const markMessagesAsRead = useCallback((from: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.from === from && msg.to === currentUser && !msg.read
          ? { ...msg, read: true }
          : msg
      )
    );
  }, [currentUser]);

  const getUnreadCount = useCallback((from: string) => {
    return messages.filter(
      msg => msg.from === from && msg.to === currentUser && !msg.read
    ).length;
  }, [currentUser, messages]);

  const getConversations = useCallback(() => {
    const conversations = new Map<string, {
      user: string;
      lastMessage: ChatMessage | null;
      unreadCount: number;
    }>();

    messages.forEach(msg => {
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
      return b.lastMessage.timestamp - a.lastMessage.timestamp;
    });
  }, [messages, currentUser]);

  const clearNotifications = useCallback(() => {
    setNewMessageCount(0);
    // Broadcast to other tabs
    const channel = new BroadcastChannel('team-chat');
    channel.postMessage({
      type: 'CLEAR_NOTIFICATIONS',
      data: { user: currentUser }
    });
    channel.close();
  }, [currentUser]);

  return {
    onlineUsers,
    messages,
    isConnected,
    newMessageCount,
    sendMessage,
    getMessagesBetween,
    markMessagesAsRead,
    getUnreadCount,
    getConversations,
    updateUserActivity,
    clearNotifications
  };
}