import type { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository.js';
import type { Notification } from '@/domain/notification/enterprise/entities/notification.js';

export class InMemoryNotificationsRepository implements NotificationsRepository {
  public items: Notification[] = [];

  constructor() {}

  async findById(id: String) {
    const notification = this.items.find(
      (notification) => notification.id.toString() === id,
    );
    if (!notification) return null;
    return notification;
  }
  async save(notification: Notification) {
    const notificationIndex = this.items.findIndex(
      (notificationItem) => notificationItem.id === notification.id,
    );
    if (notificationIndex > -1) {
      this.items[notificationIndex] = notification;
    }
  }

  async create(notification: Notification) {
    this.items.push(notification);
  }
}
