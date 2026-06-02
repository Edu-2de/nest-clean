import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import z from 'zod';
import { CurrentUser } from '../auth/current-user.decorator';
import type { TokenPayload } from '../auth/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

const createQuestionSchema = z.object({
  title: z.string(),
  description: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionSchema>;

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@CurrentUser() user: TokenPayload) {
    console.log(user);
  }
}
