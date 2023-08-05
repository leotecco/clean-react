import { faker } from '@faker-js/faker'
import axios from 'axios'

export const mockHttpResponse = (): any => {
  return {
    data: {
      customer: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName()
      }
    },
    status: faker.string.numeric(3)
  }
}

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  mockedAxios.post.mockResolvedValue(mockHttpResponse())

  return mockedAxios
}
