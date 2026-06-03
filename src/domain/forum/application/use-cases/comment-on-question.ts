import { left, right, type Either } from '@/core/either.js';
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { QuestionComment } from '../../enterprise/entities/question-comment.js';
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository.js';
import type { QuestionsRepository } from '../repositories/questions-repository.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';
import { Injectable } from '@nestjs/common';

interface CommentOnQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
  content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const questionFound = this.questionsRepository.findById(questionId);
    if (!questionFound) return left(new ResourceNotFoundError());

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      content,
      questionId: new UniqueEntityId(questionId),
    });

    await this.questionCommentsRepository.create(questionComment);

    return right({ questionComment });
  }
}
