import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository.js';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.js';

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = [];

  constructor() {}

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (answerAttachment) => answerAttachment.answerId.toString() === answerId,
    );

    return answerAttachments;
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachaments = this.items.filter(
      (answerAttachment) => answerAttachment.answerId.toString() === answerId,
    );

    this.items = answerAttachaments;
  }
}
