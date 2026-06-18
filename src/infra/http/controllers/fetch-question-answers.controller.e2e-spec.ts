import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from '../../../../test/factories/make-answer'
import { QuestionFactory } from '../../../../test/factories/make-question'
import { StudentFactory } from '../../../../test/factories/make-student'

describe('Fetch Question Answers (E2E)', () => {
  let app: INestApplication
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AnswerFactory, QuestionFactory, StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    studentFactory = moduleRef.get(StudentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:id/answers', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 01',
    })

    await Promise.all([
      answerFactory.makeAnswerPrismaFactory({
        authorId: user.id,
        questionId: question.id,
        content: 'Answer01',
      }),
      answerFactory.makeAnswerPrismaFactory({
        authorId: user.id,
        questionId: question.id,
        content: 'Answer02',
      }),
    ])

    const id = question.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/questions/${id}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({ content: 'Answer01' }),
        expect.objectContaining({ content: 'Answer02' }),
      ]),
    })
  })
})
