import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import {
  Prisma,
  Notification as PrismaNotification,
} from '@/generated/prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        content: raw.content,
        recipientId: new UniqueEntityId(raw.recipientId),
        createdAt: raw.createdAt,
        title: raw.title,
        readAt: raw.readAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      content: notification.content,
      title: notification.title,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    }
  }
}
