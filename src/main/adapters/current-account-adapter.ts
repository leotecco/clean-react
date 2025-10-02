import { type AccountModel } from '@/domain/models'
import { makeLocalStorageAdapter } from '@/main/factories/cache'

export const setCurrenctAccountAdapter = (account: AccountModel): void => {
  makeLocalStorageAdapter().set('account', account)
}

export const getCurrenctAccountAdapter = (): AccountModel => {
  return makeLocalStorageAdapter().get('account')
}
