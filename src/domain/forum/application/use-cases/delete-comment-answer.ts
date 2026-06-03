import { left, right, type Either } from '@/core/either.js';
import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository.js';
import { NotAllowedError } from './errors/not-allowed-error.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';

interface DeleteAnswerCommentUseCaseRequest {
  answerCommentId: string;
  authorId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerCommentFound =
      await this.answerCommentsRepository.findById(answerCommentId);

    if (!answerCommentFound) {
      return left(new ResourceNotFoundError());
    }

    if (answerCommentFound.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.answerCommentsRepository.delete(answerCommentFound);

    return right({});
  }
}
