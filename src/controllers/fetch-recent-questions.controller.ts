import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { PrismaService } from '../prisma/prisma.service';

const pageQueyParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueyParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueyParamSchema>;

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const take = 1;
    const skip = (page - 1) * take;

    const questions = await this.prisma.question.findMany({
      take,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { questions };
  }
}
