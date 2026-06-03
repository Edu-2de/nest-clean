import type { PaginationParams } from '@/core/repositories/pagination-params.js';
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository.js';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.js';

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = [];

  constructor() {}

  async findById(id: string) {
    const questionComment = this.items.find(
      (questionComment) => questionComment.id.toString() === id,
    );
    if (!questionComment) {
      return null;
    }
    return questionComment;
  }

  async finManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter(
        (questionComment) =>
          questionComment.questionId.toString() === questionId,
      )
      .sort(
        (questionComment1, questionComment2) =>
          questionComment1.createdAt.getTime() -
          questionComment2.createdAt.getTime(),
      )
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }

  async delete(questionComment: QuestionComment) {
    const questionCommentIndex = this.items.findIndex(
      (questionCommentItem) => questionCommentItem.id === questionComment.id,
    );
    if (questionCommentIndex > -1) {
      this.items.splice(questionCommentIndex, 1);
    }
  }
}
