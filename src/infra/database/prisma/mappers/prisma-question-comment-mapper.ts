import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import {
  Prisma,
  Comment as PrismaQuestionComment,
} from '@/generated/prisma/client'

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaQuestionComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Invalid comment type')
    }

    return QuestionComment.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        content: raw.content,
        questionId: new UniqueEntityId(raw.questionId!),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    questionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
      content: questionComment.content,
      questionId: questionComment.questionId.toString(),
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    }
  }
}
