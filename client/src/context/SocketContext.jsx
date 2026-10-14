import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { notificationAPI } from '../services/api';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial notifications when user logs in or switches
  const refreshNotifications = async () => {
    if (!user) return;
    try {
      const res = await notificationAPI.getAll();
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch {
      // Ignore initial notification error if server booting
    }
  };

  useEffect(() => {
    refreshNotifications();
  }, [user]);

  useEffect(() => {
    const newSocket = io('/', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[Socket] Connected to EcoVerse real-time gateway');
      if (user) {
        newSocket.emit('join', { userId: user._id, role: user.role });
      }
    });

    newSocket.on('notification:new', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    newSocket.on('notification:feed', (notif) => {
      // Optional general feed handler
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Update room membership when user identity changes
  useEffect(() => {
    if (socket && user) {
      socket.emit('join', { userId: user._id, role: user.role });
    }
  }, [socket, user]);

  const markRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        refreshNotifications,
        markRead,
        markAllRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};
