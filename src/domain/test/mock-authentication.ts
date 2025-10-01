import { faker } from '@faker-js/faker'

import { type Authentication, type AuthenticationModel, type AuthenticationParams } from '@/domain/usecases'
import { mockAccountModel } from './mock-account'

export const mockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationModel = (): AuthenticationModel => mockAccountModel()

export class AuthenticationSpy implements Authentication {
  account = mockAuthenticationModel()
  params: AuthenticationParams
  callsCount = 0

  async auth (params: AuthenticationParams): Promise<AuthenticationModel> {
    this.params = params
    this.callsCount++

    return this.account
  }
}
