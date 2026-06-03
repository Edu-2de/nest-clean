import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })
    if (!answer) return null

    return PrismaAnswerMapper.toDomain(answer)
  }
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]> {
    throw new Error('Method not implemented.')
  }
  save(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  create(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  delete(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
