import { SetStorageMock } from '@/data/test'
import { UnexpectedError } from '@/domain/errors'
import { mockAccountModel } from '@/domain/test'
import { LocalUpdateCurrentAccount } from './local-update-current-account'

type SutTypes = {
  sut: LocalUpdateCurrentAccount
  setStorageSpy: SetStorageMock
}

const makeSut = (): SutTypes => {
  const setStorageSpy = new SetStorageMock()
  const sut = new LocalUpdateCurrentAccount(setStorageSpy)

  return {
    sut,
    setStorageSpy
  }
}

describe('LocalUpdateCurrentAccount', () => {
  test('Should call SetStorage with correct value', async () => {
    const { sut, setStorageSpy } = makeSut()
    const account = mockAccountModel()

    await sut.save(account)

    expect(setStorageSpy.key).toBe('account')
    expect(setStorageSpy.value).toBe(JSON.stringify(account))
  })

  test('Should throw if SetStorage throws', async () => {
    const { sut, setStorageSpy } = makeSut()
    jest.spyOn(setStorageSpy, 'set').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.save(mockAccountModel())

    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should throw if accessToken is falsy', async () => {
    const { sut } = makeSut()

    const promise = sut.save(undefined)

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
