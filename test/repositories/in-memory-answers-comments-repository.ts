import { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository.js'
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment.js'

export class InMemoryAnswersCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  constructor() {}
  findManyByAnswerId(
    id: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string) {
    const answerComment = this.items.find(
      (answerComment) => answerComment.id.toString() === id,
    )
    if (!answerComment) return null

    return answerComment
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const anserCommentId = this.items.findIndex(
      (answerCommentItem) => answerCommentItem.id === answerComment.id,
    )
    if (anserCommentId > -1) {
      this.items.splice(anserCommentId, 1)
    }
  }
}
