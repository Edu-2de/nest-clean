import { right, type Either } from '@/core/either.js';
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { Notification } from '../../enterprise/entities/notification.js';
import type { NotificationsRepository } from '../repositories/notifications-repository.js';

interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    });

    await this.notificationsRepository.create(notification);

    return right({ notification });
  }
}
