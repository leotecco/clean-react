import { UnexpectedError } from '@/domain/errors'
import { type AccountModel } from '@/domain/models'
import { makeLocalStorageAdapter } from '@/main/factories/cache/local-storage-adapter'

export const setCurrenctAccountAdapter = (account: AccountModel): void => {
  if (!account?.accessToken) {
    throw new UnexpectedError()
  }

  makeLocalStorageAdapter().set('account', account)
}
