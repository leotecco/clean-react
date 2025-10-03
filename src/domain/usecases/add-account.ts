import { type AccountModel } from '@/domain/models'

export type AddAccountParams = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export type AddAccountModel = AccountModel

export interface AddAccount {
  add: (params: AddAccountParams) => Promise<AddAccountModel>
}
