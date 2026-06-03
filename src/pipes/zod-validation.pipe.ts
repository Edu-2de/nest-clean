import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common'
import { flattenError, ZodError, ZodType } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation Error',
          statusCode: 400,
          errors: flattenError(error),
        })
      }

      throw new BadRequestException('Validation failed')
    }
    return value
  }
}
