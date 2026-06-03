import { left, right, type Either } from '@/core/either.js';
import type { Answer } from '../../enterprise/entities/answer.js';
import type { AnswersRepository } from '../repositories/answers-repository.js';
import type { QuestionsRepository } from '../repositories/questions-repository.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';

interface FetchQuestionAnswersRequest {
  questionId: string;
  page: number;
}

type FetchQuestionAnswersResponse = Either<
  ResourceNotFoundError,
  {
    answers: Answer[];
  }
>;

export class FetchQuestionAnswers {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersRequest): Promise<FetchQuestionAnswersResponse> {
    const question = await this.questionsRepository.findById(questionId);
    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    );

    return right({ answers });
  }
}
