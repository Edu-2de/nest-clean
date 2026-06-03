import { right, type Either } from '@/core/either.js'
import type { QuestionsRepository } from '../repositories/questions-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { NotAllowedError } from './errors/not-allowed-error.js'
import { Injectable } from '@nestjs/common'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return right(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return right(new NotAllowedError())
    }

    await this.questionsRepository.delete(question)

    return right({})
  }
}
