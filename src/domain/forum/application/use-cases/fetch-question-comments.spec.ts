import { beforeEach, describe } from 'vitest';
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment.js';
import { makeQuestion } from '../../../../../test/factories/make-question.js';
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository.js';
import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository.js';
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository.js';
import { FetchQuestionComments } from './fetch-question-comments.js';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: FetchQuestionComments;

describe('Fetch Question Answer Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    sut = new FetchQuestionComments(inMemoryQuestionCommentsRepository);
  });

  it('should be able to fetch question comments', async () => {
    const question = makeQuestion();
    await inMemoryQuestionsRepository.create(question);

    for (let i = 1; i <= 3; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: question.id,
        }),
      );
    }

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
  });
});
