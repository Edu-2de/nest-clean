import type { Notification } from '../../enterprise/entities/notification.js';

export interface NotificationsRepository {
  findById(id: String): Promise<Notification | null>;
  create(notification: Notification): Promise<void>;
  save(notification: Notification): Promise<void>;
}
