import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { Injectable } from '@nestjs/common'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })
    if (!comment) return null
    return PrismaQuestionCommentMapper.toDomain(comment)
  }

  async finManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const comments = await this.prisma.comment.findMany({
      take: 20,
      skip: (page - 1) * 20,
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return comments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async finManyByQuestionIdWithAutor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = await this.prisma.comment.findMany({
      take: 20,
      skip: (page - 1) * 20,
      where: {
        questionId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return comments.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)
    await this.prisma.comment.create({
      data,
    })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)
    await this.prisma.comment.delete({
      where: {
        id: data.id,
      },
    })
  }
}
