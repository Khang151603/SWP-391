import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../api/services/notification.service';
import type { Notification } from '../api/types/notification.types';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { tokenManager } from '../api/utils/tokenManager';
import { API_BASE_URL } from '../api/config/constants';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getUnreadNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  // Setup SignalR connection
  useEffect(() => {
    const token = tokenManager.getToken();
    if (!token) return;

    const hubUrl = `${API_BASE_URL}/notiHub`;
    
    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, []);

  // Start connection and setup event handlers
  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log('SignalR Connected');

        // Join user's notification group
        const userInfo = tokenManager.getUserInfo();
        if (userInfo?.accountId) {
          await connection.invoke('Join', userInfo.accountId);
        }

        // Fetch initial notifications
        fetchNotifications();
      } catch (error) {
        console.error('SignalR Connection Error:', error);
      }
    };

    // Listen for new notifications
    connection.on('ReceiveNotification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    startConnection();

    return () => {
      connection.stop();
    };
  }, [connection, fetchNotifications]);

  return {
    notifications,
    isLoading,
    unreadCount: notifications.length,
    markAsRead,
    refreshNotifications: fetchNotifications
  };
};
