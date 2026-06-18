import { ChoseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/chose-question-best-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { TokenPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('/answers/:id/chose-as-best')
export class ChoseQuestionBestAnswerController {
  constructor(
    private choseQuestionBestAnswerUseCase: ChoseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('id') answerId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const userId = user.sub

    const result = await this.choseQuestionBestAnswerUseCase.execute({
      authorId: userId,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
