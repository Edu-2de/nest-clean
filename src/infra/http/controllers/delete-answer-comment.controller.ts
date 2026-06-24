import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-comment-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { TokenPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') answerCommentId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const userId = user.sub
    const result = await this.deleteAnswerCommentUseCase.execute({
      authorId: userId,
      answerCommentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
