import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params.js'
import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository.js'
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository.js'
import type { Question } from '@/domain/forum/enterprise/entities/question.js'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findManyByRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort(
        (question1, question2) =>
          question2.createdAt.getTime() - question1.createdAt.getTime(),
      )
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async findById(id: string) {
    const question = this.items.find((question) => question.id.toString() == id)
    if (!question) return null

    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find((question) => question.slug.value === slug)
    if (!question) {
      return null
    }
    return question
  }

  async create(question: Question) {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const questionIndex = this.items.findIndex(
      (questionItem) => questionItem.id === question.id,
    )
    if (questionIndex > -1) {
      this.items[questionIndex] = question
    }

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const questionIndex = this.items.findIndex(
      (questionItem) => questionItem.id === question.id,
    )
    if (questionIndex > -1) {
      this.items.splice(questionIndex, 1)
    }

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
