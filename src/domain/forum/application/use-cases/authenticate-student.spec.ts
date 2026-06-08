import { FakeEncrypter } from '../../../../../test/cryptography/fake-encrypter'
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'

describe('Authenticate Student Use Case', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let fakeHasher: FakeHasher
  let fakeEncrypter: FakeEncrypter
  let sut: AuthenticateStudentUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })
    inMemoryStudentsRepository.items.push(student)

    const result = await sut.execute({
      email: student.email,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
