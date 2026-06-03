import { right, type Either } from '@/core/either.js';
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { Answer } from '@/domain/forum/enterprise/entities/answer.js';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list.js';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment.js';
import type { AnswersRepository } from '../repositories/answers-repository.js';

interface AnswerQuestionUseCaseRequest {
  content: string;
  instructorId: string;
  attachmentsIds: string[];
  questionId: string;
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer;
  }
>;

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    content,
    instructorId,
    questionId,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    });

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answersRepository.create(answer);

    return right({ answer });
  }
}
