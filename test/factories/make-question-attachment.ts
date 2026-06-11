import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import {
  QuestionAttachment,
  type QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment.js'
import { PrismaQuestionAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-question-attachment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityId,
) {
  const question = QuestionAttachment.create(
    {
      questionId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return question
}
