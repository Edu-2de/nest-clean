import { HashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashCompare, HashGenerator {
  hash(plain: string) {
    return bcrypt.hash(plain, 8)
  }

  compare(plain: string, hash: string) {
    return bcrypt.compare(plain, hash)
  }
}
