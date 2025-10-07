import { faker } from '@faker-js/faker'
import * as Http from './http-mocks'

export const mockUnexpectedError = (): void => {
  Http.mockServerError(/signup/, 'POST')
}

export const mockEmailInUseError = (): void => {
  Http.mockForbiddenError(/signup/, 'POST')
}

export const mockOk = (): void => {
  Http.mockOk(/signup/, 'POST', {
    accessToken: faker.string.uuid(),
    name: faker.person.fullName()
  })
}

export const mockSurveys = (): void => {
  Http.mockOk(/surveys/, 'GET', [])
}
