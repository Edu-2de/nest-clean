import { left, right, type Either } from '@/core/either'
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: string
  authorId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionCommentFound =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionCommentFound) return left(new ResourceNotFoundError())

    if (questionCommentFound.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }
    await this.questionCommentsRepository.delete(questionCommentFound)

    return right({})
  }
}
