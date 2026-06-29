import { ValueObject } from '@/core/entities/value-object'

export interface CommentWithAuthorProps {
  commentId: string
  content: string
  authorId: string
  author: string
  createdAt: Date
  updateAt?: Date | null
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  get commentId() {
    return this.commentId
  }

  get content() {
    return this.content
  }

  get authorId() {
    return this.authorId
  }

  get author() {
    return this.author
  }

  get createdAt() {
    return this.createdAt
  }

  get updateAt() {
    return this.updateAt
  }

  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }
}
