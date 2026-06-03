import { DomainEvents } from '@/core/events/domain-events.js';
import type { PaginationParams } from '@/core/repositories/pagination-params.js';
import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository.js';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository.js';
import { Answer } from '@/domain/forum/enterprise/entities/answer.js';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((answer) => answer.questionId.toString() === questionId)
      .sort(
        (answer1, answer2) =>
          answer1.createdAt.getTime() - answer2.createdAt.getTime(),
      )
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async findById(id: string) {
    const answer = this.items.find((answer) => answer.id.toString() === id);
    if (!answer) return null;
    return answer;
  }

  async save(answer: Answer) {
    const answerId = this.items.findIndex(
      (answerItem) => answerItem.id === answer.id,
    );
    if (answerId > -1) {
      this.items[answerId] = answer;
    }

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async create(answer: Answer) {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer) {
    const answerId = this.items.findIndex(
      (answerItem) => answerItem.id === answer.id,
    );
    if (answerId > -1) {
      this.items.splice(answerId, 1);
    }

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
  }
}
