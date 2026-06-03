import type { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import type { DomainEvent } from '@/core/events/domain-event.js';
import type { Answer } from '../entities/answer.js';

export class AnswerCreatedEvent implements DomainEvent {
  public occurredAt: Date;
  public answer: Answer;

  constructor(answer: Answer) {
    this.answer = answer;
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.answer.id;
  }
}
