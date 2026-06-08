import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Prisma, Answer as PrismaAnswer } from '@/generated/prisma/client'

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

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      content: answer.content,
      authorId: answer.authorId.toString(),
      questionId: answer.questionId.toString(),
    }
  }
}
