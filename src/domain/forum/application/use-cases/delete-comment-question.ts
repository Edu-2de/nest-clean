import { left, right, type Either } from '@/core/either.js';
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository.js';
import { NotAllowedError } from './errors/not-allowed-error.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';

interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: string;
  authorId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionCommentFound =
      await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionCommentFound) return left(new ResourceNotFoundError());

    if (questionCommentFound.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }
    await this.questionCommentsRepository.delete(questionCommentFound);

    return right({});
  }
}
