import { beforeEach, describe, it } from 'vitest';
import { makeQuestion } from '../../../../../test/factories/make-question.js';
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository.js';
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository.js';
import { Slug } from '../../enterprise/entities/value-objects/slug.js';
import { GetQuestionBySlugUseCase } from './get-question-by-slug.js';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const question = makeQuestion({
      title: 'title example',
      slug: Slug.create('title-example'),
    });
    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({ slug: 'title-example' });

    expect(result.isRight()).toBe(true);
  });
});
