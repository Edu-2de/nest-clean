import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/students-already-exists-error'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const createAccountSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
})

type CreateAccountBodySchema = z.infer<typeof createAccountSchema>

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerStundent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerStundent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
