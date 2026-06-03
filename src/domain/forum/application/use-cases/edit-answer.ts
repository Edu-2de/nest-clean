import { left, right, type Either } from '@/core/either.js'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list.js'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment.js'
import type { Answer } from '../../enterprise/entities/answer.js'
import type { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository.js'
import type { AnswersRepository } from '../repositories/answers-repository.js'
import { NotAllowedError } from './errors/not-allowed-error.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { Injectable } from '@nestjs/common'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    attachmentsIds,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const answerAttachments = attachmentsIds.map((attachmentsId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentsId),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(answerAttachments)
    answer.attachments = answerAttachmentList

    answer.content = content

    await this.answersRepository.save(answer)

    return right({ answer })
  }
}
