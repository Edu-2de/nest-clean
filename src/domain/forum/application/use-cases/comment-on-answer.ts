import { left, right, type Either } from '@/core/either.js'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import { AnswerComment } from '../../enterprise/entities/answer-comment.js'
import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository.ts'
import type { AnswersRepository } from '../repositories/answers-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { Injectable } from '@nestjs/common'

interface CommentOnAnswerUseCaseRequest {
  answerId: string
  authorId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answerFound = this.answersRepository.findById(answerId)
    if (!answerFound) return left(new ResourceNotFoundError())

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      content,
      answerId: new UniqueEntityId(answerId),
    })

    await this.answerCommentsRepository.create(answerComment)

    return right({ answerComment })
  }
}
