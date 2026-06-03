import type { PaginationParams } from '@/core/repositories/pagination-params.js';
import type { Question } from '../../enterprise/entities/question.js';

export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>;
  findBySlug(slug: string): Promise<Question | null>;
  findManyByRecent(params: PaginationParams): Promise<Question[]>;
  save(question: Question): Promise<void>;
  create(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
}
