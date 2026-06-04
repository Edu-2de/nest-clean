import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { beforeEach, describe } from 'vitest'
import { makeAnswerComment } from '../../../../../test/factories/make-question-answer'
import { InMemoryAnswersCommentsRepository } from '../../../../../test/repositories/in-memory-answers-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-comment-answer'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionAnswersRepository: InMemoryAnswersCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Question Answer Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAnswersRepository = new InMemoryAnswersCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryQuestionAnswersRepository)
  })

  it('should be able to delete a question answer', async () => {
    const questionAnswer = makeAnswerComment()
    await inMemoryQuestionAnswersRepository.create(questionAnswer)

    await sut.execute({
      answerCommentId: questionAnswer.id.toString(),
      authorId: questionAnswer.authorId.toString(),
    })

    expect(inMemoryQuestionAnswersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a another author question answer', async () => {
    const questionAnswer = makeAnswerComment({
      authorId: new UniqueEntityId('author-02'),
    })
    await inMemoryQuestionAnswersRepository.create(questionAnswer)

    const result = await sut.execute({
      answerCommentId: questionAnswer.id.toString(),
      authorId: 'author-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
