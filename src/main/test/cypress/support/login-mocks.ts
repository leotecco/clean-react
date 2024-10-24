import { faker } from '@faker-js/faker'
import * as Helper from './http-mocks'

export const mockUnexpectedError = (): void => {
  Helper.mockUnexpectedError(/login/, 'POST')
}

export const mockInvalidCredentialsError = (): void => {
  Helper.mockInvalidCredentialsError(/login/)
}

export const mockInvalidData = (): void => {
  Helper.mockOk(/login/, 'POST', {
    invalid: faker.string.uuid()
  })
}

export const mockOk = (): void => {
  Helper.mockOk(/login/, 'POST', {
    accessToken: faker.string.uuid()
  })
}
