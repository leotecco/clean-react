import { HttpPostClientSpy } from '@/data/test'
import { type AccountModel } from '@/domain/models'
import { mockAccountModel, mockAddAccountParams } from '@/domain/test'
import { type AuthenticationParams } from '@/domain/usecases'
import { RemoteAddAccount } from './remote-add-account'
import { HttpStatusCode } from '@/data/protocols/http'
import { EmailInUseError, UnexpectedError } from '@/domain/errors'
import { faker } from '@faker-js/faker'

type SutTypes = {
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
  sut: RemoteAddAccount
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
  const sut = new RemoteAddAccount(url, httpPostClientSpy)

  return {
    httpPostClientSpy,
    sut
  }
}

describe('RemoteAddAccount', () => {
  test('Should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)

    await sut.add(mockAddAccountParams())

    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpPostClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()

    await sut.add(addAccountParams)

    expect(httpPostClientSpy.body).toEqual(addAccountParams)
  })

  test('Should throw EmailInUseError if HttpPostClient returns 403', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow(new EmailInUseError())
  })

  test('Should throw UnexpectedError if HttpPostClient returns 400', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return an AccountModel if HttpPostClient returns 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const httpResult = mockAccountModel()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }

    const account = await sut.add(mockAddAccountParams())

    expect(account).toEqual(httpResult)
  })
})
