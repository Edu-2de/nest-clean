import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import {
  Prisma,
  Comment as PrismaAnswerComment,
} from '@/generated/prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaAnswerComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type')
    }

    return AnswerComment.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        answerId: new UniqueEntityId(raw.answerId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    answercomment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answercomment.id.toString(),
      content: answercomment.content,
      authorId: answercomment.authorId.toString(),
      answerId: answercomment.answerId.toString(),
      createdAt: answercomment.createdAt,
      updatedAt: answercomment.updatedAt,
    }
  }
}
