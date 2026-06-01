import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import z from 'zod';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

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
  async handle(@Body() body: CreateQuestionBodySchema) {
    const { title, description } = body;
  }
}
