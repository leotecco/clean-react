import { faker } from '@faker-js/faker'

import { mockAccountModel } from '@/domain/test'
import { type AddAccount, type AddAccountModel, type AddAccountParams } from '@/domain/usecases'

export const mockAddAccountParams = (): AddAccountParams => {
  const password = faker.internet.password()

  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}

export const mockAddAccountModel = (): AddAccountModel => mockAccountModel()

export class AddAccountSpy implements AddAccount {
  account = mockAddAccountModel()
  params: AddAccountParams
  callsCount = 0

  async add (params: AddAccountParams): Promise<AddAccountModel> {
    this.params = params
    this.callsCount++

    return this.account
  }
}
