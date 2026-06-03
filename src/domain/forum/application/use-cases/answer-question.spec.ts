import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository.js';
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository.js';
import { AnswerQuestionUseCase } from './answer-question.js';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'content',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems,
    ).toHaveLength(2);
  });
});
