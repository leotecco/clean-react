import { mockAccountModel } from '@/domain/test'
import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import { setCurrenctAccountAdapter } from './current-account-adapter'
import { UnexpectedError } from '@/domain/errors'

jest.mock('@/infra/cache/local-storage-adapter')

describe('CurrenctAccountAdapter', () => {
  it('Should call LocalStorageAdapter with correct values', () => {
    const account = mockAccountModel()
    const setSpy = jest.spyOn(LocalStorageAdapter.prototype, 'set')

    setCurrenctAccountAdapter(account)

    expect(setSpy).toHaveBeenCalledWith('account', account)
  })

  it('Should throw UnexpectedError', () => {
    expect(() => {
      setCurrenctAccountAdapter(undefined)
    }).toThrow(new UnexpectedError())
  })
})
