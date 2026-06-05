import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import z from 'zod'
import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueyParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueyParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueyParamSchema>

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentQuestions.execute({
      page,
    })

    if (result.isLeft()) throw new Error()

    const questions = result.value.questions

    return {
      questions: questions.map((question) => {
        return QuestionPresenter.toHTTP(question)
      }),
    }
  }
}
