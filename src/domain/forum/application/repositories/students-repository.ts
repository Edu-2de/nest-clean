import { Student } from '../../enterprise/entities/student'

export abstract class StudentsRepository {
  abstract findById(id: string): Promise<Student | null>
}
