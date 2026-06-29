import { beforeEach, describe, it } from 'vitest'
import { makeAttachment } from '../../../../../test/factories/make-attachment'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { makeQuestionAttachment } from '../../../../../test/factories/make-question-attachment'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryAttachmentsRepository } from '../../../../../test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryAttachmentRepository = new InMemoryAttachmentsRepository()

    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const author = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(author)

    const question = makeQuestion({
      title: 'title example',
      slug: Slug.create('title-example'),
      authorId: author.id,
    })
    await inMemoryQuestionsRepository.create(question)

    const attachment = makeAttachment({
      title: 'Attachment1',
    })
    inMemoryAttachmentRepository.items.push(attachment)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: question.id,
      }),
    )

    const result = await sut.execute({ slug: 'title-example' })

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: question.title,
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'Attachment1',
          }),
        ],
      }),
    })
  })
})
