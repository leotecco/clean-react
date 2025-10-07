import { faker } from '@faker-js/faker'
import * as Http from './http-mocks'

export const mockUnexpectedError = (): void => {
  Http.mockServerError(/login/, 'POST')
}

export const mockInvalidCredentialsError = (): void => {
  Http.mockUnauthorizedError(/login/)
}

export const mockOk = (): void => {
  Http.mockOk(/login/, 'POST', {
    accessToken: faker.string.uuid(),
    name: faker.person.fullName()
  })
}

export const mockSurveys = (): void => {
  Http.mockOk(/surveys/, 'GET', [])
}
