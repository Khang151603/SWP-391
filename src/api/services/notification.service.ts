import { httpClient } from '../config/client';
import type { Notification } from '../types/notification.types';

class NotificationService {
  /**
   * Get unread notifications for current user
   */
  async getUnreadNotifications(): Promise<Notification[]> {
    return httpClient.get<Notification[]>('/notification');
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    return httpClient.post(`/notification/read/${notificationId}`, {});
  }
}

export const notificationService = new NotificationService();
