import { faker } from '@faker-js/faker'
import { FieldValidationSpy } from '../test/mock-validation'
import { ValidationComposite } from './validation-composite'

type SutTypes = {
  sut: ValidationComposite
  fieldValidationSpy: FieldValidationSpy[]
}

const makeSut = (fieldName: string): SutTypes => {
  const fieldValidationSpy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName)
  ]
  const sut = new ValidationComposite(fieldValidationSpy)

  return {
    sut,
    fieldValidationSpy
  }
}

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fieldName = faker.database.column()
    const { sut, fieldValidationSpy } = makeSut(fieldName)
    const errorMessage = faker.random.words()
    fieldValidationSpy[0].error = new Error(errorMessage)
    fieldValidationSpy[1].error = new Error(faker.random.words())
    const error = sut.validate(fieldName, faker.random.words())
    expect(error).toBe(errorMessage)
  })

  test('Should return null if validation succeed', () => {
    const fieldName = faker.database.column()
    const { sut } = makeSut(fieldName)
    const error = sut.validate('any_field', faker.random.words())
    expect(error).toBeFalsy()
  })
})
