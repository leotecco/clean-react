import { type HttpGetClient, type HttpGetParams, type HttpPostClient, type HttpPostParams, type HttpResponse, HttpStatusCode } from '@/data/protocols/http'
import { faker } from '@faker-js/faker'

export const mockPostRequest = (): HttpPostParams => ({
  url: faker.internet.url(),
  body: {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName()
  }
})

export const mockGetRequest = (): HttpGetParams => ({
  url: faker.internet.url(),
  headers: {
    field: faker.string.uuid()
  }
})

export class HttpPostClientSpy<R = any> implements HttpPostClient<R> {
  url?: string
  body?: any
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok
  }

  async post (params: HttpPostParams): Promise<HttpResponse<R>> {
    this.url = params.url
    this.body = params.body

    return this.response
  }
}

export class HttpGetClientSpy<R = any> implements HttpGetClient<R> {
  url: string
  headers: any
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok
  }

  async get (params: HttpGetParams): Promise<HttpResponse<R>> {
    this.url = params.url
    this.headers = params.headers

    return this.response
  }
}
