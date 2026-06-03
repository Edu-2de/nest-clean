import { left, right, type Either } from '@/core/either.js'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list.js'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment.js'
import type { Question } from '../../enterprise/entities/question.js'
import type { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository.js'
import type { QuestionsRepository } from '../repositories/questions-repository.js'
import { NotAllowedError } from './errors/not-allowed-error.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { Injectable } from '@nestjs/common'

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentsIds.map((attachmentsId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentsId),
        questionId: question.id,
      })
    })

    questionAttachmentList.update(questionAttachments)
    question.attachments = questionAttachmentList

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)

    return right({ question })
  }
}
