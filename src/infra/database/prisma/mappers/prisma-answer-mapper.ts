import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Answer as PrismaAnswer } from '@/generated/prisma/client'

export class PrismaAnswerMapper {
  static toDomain(answer: PrismaAnswer): Answer {
    return Answer.create(
      {
        authorId: new UniqueEntityId(answer.authorId),
        content: answer.content,
        questionId: new UniqueEntityId(answer.questionId),
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
      },
      new UniqueEntityId(answer.id),
    )
  }
}
