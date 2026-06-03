import { beforeEach, describe } from 'vitest';
import { makeAnswer } from '../../../../../test/factories/make-answer.js';
import { InMemoryAnswersCommentsRepository } from '../../../../../test/repositories/in-memory-answers-comments-repository.js';
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository.js';
import { CommentOnAnswerUseCase } from './comment-on-answer.js';
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository.js';

let inMemoryAnswerCommentsRepository: InMemoryAnswersCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment On Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswersCommentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    );
  });

  it('should be able to comment on a answer', async () => {
    const answer = makeAnswer();
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'comment',
    });

    expect(inMemoryAnswerCommentsRepository.items[0]?.content).toEqual(
      'comment',
    );
    expect(result.isRight()).toBe(true);
  });
});
