import type { PaginationParams } from '@/core/repositories/pagination-params.js'
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository.js'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.js'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string) {
    const questionComment = this.items.find(
      (questionComment) => questionComment.id.toString() === id,
    )
    if (!questionComment) {
      return null
    }
    return questionComment
  }

  async finManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter(
        (questionComment) =>
          questionComment.questionId.toString() === questionId,
      )
      .sort(
        (questionComment1, questionComment2) =>
          questionComment1.createdAt.getTime() -
          questionComment2.createdAt.getTime(),
      )
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async finManyByQuestionIdWithAutor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with Id ${comment.authorId.toString()} does not exists`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updateAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return questionComments
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    const questionCommentIndex = this.items.findIndex(
      (questionCommentItem) => questionCommentItem.id === questionComment.id,
    )
    if (questionCommentIndex > -1) {
      this.items.splice(questionCommentIndex, 1)
    }
  }
}
