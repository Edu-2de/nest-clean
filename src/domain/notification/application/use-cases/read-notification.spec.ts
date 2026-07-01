import { makeNotification } from '@/../test/factories/make-notification'
import { InMemoryNotificationsRepository } from '@/../test/repositories/in-memory-notifications-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { describe, expect, it } from 'vitest'
import { ReadNotificationUseCase } from './read-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read an notification', async () => {
    const notification = makeNotification(
      { recipientId: new UniqueEntityId('1') },
      new UniqueEntityId('1'),
    )
    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: '1',
      notificationId: '1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]?.readAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to read an notification from another user', async () => {
    const notification = makeNotification(
      { recipientId: new UniqueEntityId('1') },
      new UniqueEntityId('1'),
    )
    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: '2',
      notificationId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
