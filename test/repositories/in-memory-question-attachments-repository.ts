import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository.js';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.js';

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  public items: QuestionAttachment[] = [];

  constructor() {}

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (questionAttachment) =>
        questionAttachment.questionId.toString() === questionId,
    );

    return questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachaments = this.items.filter(
      (questionAttachment) =>
        questionAttachment.questionId.toString() === questionId,
    );

    this.items = questionAttachaments;
  }
}
