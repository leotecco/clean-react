import { faker } from '@faker-js/faker'

import { InvalidFieldError } from '@/validation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (valueToCompare: string): CompareFieldsValidation => new CompareFieldsValidation(faker.database.column(), valueToCompare)

describe('CompareFieldsValidation', () => {
  test('Should return error if compare is invalid', () => {
    const sut = makeSut(faker.word.sample())

    const error = sut.validate(faker.word.sample())

    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return error if compare is valid', () => {
    const valueToCompare = faker.word.sample()

    const sut = makeSut(valueToCompare)

    const error = sut.validate(valueToCompare)

    expect(error).toBeFalsy()
  })
})
