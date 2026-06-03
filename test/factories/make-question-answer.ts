import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import {
  AnswerComment,
  type AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment.js';

import { faker } from '@faker-js/faker';

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId,
) {
  const answer = AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answer;
}
