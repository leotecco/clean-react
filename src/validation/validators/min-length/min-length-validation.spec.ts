import { faker } from '@faker-js/faker'
import { MinLengthValidation } from './min-length-validation'
import { InvalidFieldError } from '@/validation/errors'

const makeSut = (field: string): MinLengthValidation => new MinLengthValidation(field, 5)

describe('MinLengthValidation', () => {
  test('Should return error if value is invalid', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.string.alphanumeric(4) })
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if value is valid', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.string.alphanumeric(5) })
    expect(error).toBeFalsy()
  })

  test('Should return falsy if field does not exists in schema', () => {
    const sut = makeSut('Any field')
    const error = sut.validate({ invalidField: faker.string.alphanumeric(5) })
    expect(error).toBeFalsy()
  })
})
