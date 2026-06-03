import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { beforeEach, describe } from 'vitest';
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment.js';
import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository.js';
import { DeleteQuestionCommentUseCase } from './delete-comment-question.js';
import { NotAllowedError } from './errors/not-allowed-error.js';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment();
    await inMemoryQuestionCommentsRepository.create(questionComment);

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a another author question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-02'),
    });
    await inMemoryQuestionCommentsRepository.create(questionComment);

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
