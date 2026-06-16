import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

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
