import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { describe, it } from 'vitest';
import { makeAnswer } from '../../../../../test/factories/make-answer.js';
import { makeQuestion } from '../../../../../test/factories/make-question.js';
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository.js';
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository.js';
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository.js';
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository.js';
import { ChoseQuestionBestAnswerUseCase } from './chose-question-best-answer.js';
import { NotAllowedError } from './errors/not-allowed-error.js';

let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: ChoseQuestionBestAnswerUseCase;

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new ChoseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswersRepository,
    );
  });

  it('should be able to choose the best answer to the question', async () => {
    await inMemoryQuestionRepository.create(
      makeQuestion(
        {
          authorId: new UniqueEntityId('author-01'),
        },
        new UniqueEntityId('question-01'),
      ),
    );

    await inMemoryAnswersRepository.create(
      makeAnswer(
        {
          authorId: new UniqueEntityId('author-02'),
          questionId: new UniqueEntityId('question-01'),
        },
        new UniqueEntityId('answer-01'),
      ),
    );

    const result = await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-01',
    });

    expect(result.isRight()).toBe(true);
  });

  it('should not be able to choose another best question from another user question', async () => {
    await inMemoryQuestionRepository.create(
      makeQuestion(
        {
          authorId: new UniqueEntityId('author-01'),
        },
        new UniqueEntityId('question-01'),
      ),
    );

    await inMemoryAnswersRepository.create(
      makeAnswer(
        {
          authorId: new UniqueEntityId('author-02'),
          questionId: new UniqueEntityId('question-01'),
        },
        new UniqueEntityId('answer-01'),
      ),
    );

    const result = await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-02',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
