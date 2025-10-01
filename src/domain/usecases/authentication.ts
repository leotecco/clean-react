import { type AccountModel } from '@/domain/models'

export type AuthenticationParams = {
  email: string
  password: string
}

export type AuthenticationModel = AccountModel

export interface Authentication {
  auth: (params: AuthenticationParams) => Promise<AuthenticationModel>
}
