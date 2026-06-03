import type { PaginationParams } from '@/core/repositories/pagination-params.js';
import type { Answer } from '@/domain/forum/enterprise/entities/answer.js';

export interface AnswersRepository {
  findById(id: string): Promise<Answer | null>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
  save(answer: Answer): Promise<void>;
  create(answer: Answer): Promise<void>;
  delete(answer: Answer): Promise<void>;
}
