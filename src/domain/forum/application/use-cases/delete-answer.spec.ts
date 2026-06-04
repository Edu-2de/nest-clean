import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { beforeEach, describe, it } from 'vitest'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete a answer', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer(
        { authorId: new UniqueEntityId('author-01') },
        new UniqueEntityId('answer-01'),
      ),
    )

    const result = await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-01',
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
  })

  it('should not to be able delete a answer from another author', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer(
        { authorId: new UniqueEntityId('author01') },
        new UniqueEntityId('answer-01'),
      ),
    )

    const result = await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-02',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
