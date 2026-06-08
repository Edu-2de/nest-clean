import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

const createAccountSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
})

type CreateAccountBodySchema = z.infer<typeof createAccountSchema>

@Controller('/accounts')
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
      throw new Error()
    }
  }
}
