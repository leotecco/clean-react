import { faker } from '@faker-js/faker'
import { type AccountModel } from '../models'

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.string.alphanumeric(32),
  name: faker.person.fullName()
})
