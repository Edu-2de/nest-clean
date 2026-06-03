import { right, type Either } from '@/core/either.js'
import type { QuestionComment } from '../../enterprise/entities/question-comment.js'
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository.js'
import { Injectable } from '@nestjs/common'

interface FetchQuestionCommentsRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>

@Injectable()
export class FetchQuestionComments {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsRequest): Promise<FetchQuestionCommentsResponse> {
    const questionComments =
      await this.questionCommentsRepository.finManyByQuestionId(questionId, {
        page,
      })

    return right({ questionComments })
  }
}
