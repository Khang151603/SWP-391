import { httpClient } from '../config/client';
import { NOTIFICATION_ENDPOINTS } from '../config/constants';
import type { Notification } from '../types/notification.types';

/**
 * Notification Service
 * 
 * Used by:
 * - Hooks: useNotifications.ts
 * - Components: NotificationBell.tsx (via useNotifications hook)
 */
class NotificationService {
  /**
   * Get unread notifications for current user
   */
  async getUnreadNotifications(): Promise<Notification[]> {
    return httpClient.get<Notification[]>(NOTIFICATION_ENDPOINTS.UNREAD);
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    return httpClient.post(NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId), {});
  }
}

export const notificationService = new NotificationService();
