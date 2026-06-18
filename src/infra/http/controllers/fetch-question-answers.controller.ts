import { FetchQuestionAnswers } from '@/domain/forum/application/use-cases/fetch-question-answers'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { AnswerPresenter } from '../presenters/answer-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:id/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswersUseCase: FetchQuestionAnswers) {}

  @Get()
  async handle(
    @Param('id') questionId: string,
    @Query('page', queryValidationPipe) page: PageQueryParam,
  ) {
    const result = await this.fetchQuestionAnswersUseCase.execute({
      questionId,
      page: 1,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answers = result.value.answers

    return { answers: answers.map(AnswerPresenter.toHTTP) }
  }
}
