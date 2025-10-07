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
  Http.mockOk(/surveys/, 'GET', [
    {
      question: 'Test',
      answers: [],
      date: '2025-10-01T01:49:39.154Z',
      didAnswer: false,
      id: '68dc88b355041e20c603866e'
    }
  ])
}
