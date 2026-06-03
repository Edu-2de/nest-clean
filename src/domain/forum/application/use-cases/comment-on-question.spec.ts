import { beforeEach, describe } from 'vitest';
import { makeQuestion } from '../../../../../test/factories/make-question.js';
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository.js';
import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository.js';
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository.js';
import { CommentOnQuestionUseCase } from './comment-on-question.js';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment On Question Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it('should be able to comment on a question', async () => {
    const question = makeQuestion();
    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'comment',
    });

    expect(inMemoryQuestionCommentsRepository.items[0]?.content).toEqual(
      'comment',
    );
    expect(result.isRight()).toBe(true);
  });
});
