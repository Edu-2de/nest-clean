import { left, right, type Either } from '@/core/either.js'
import type { AnswersRepository } from '../repositories/answers-repository.js'
import { NotAllowedError } from './errors/not-allowed-error.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type DeleteAnswerUseCseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCseResponse> {
    const answerFound = await this.answersRepository.findById(answerId)

    if (!answerFound) {
      return left(new ResourceNotFoundError())
    }

    if (answerFound.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answerFound)

    return right({})
  }
}
