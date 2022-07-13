import { faker } from '@faker-js/faker'
import axios from 'axios'

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  mockedAxios.post.mockResolvedValue({
    data: {
      customer: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      }
    },
    status: faker.random.numeric(3)
  })

  return mockedAxios
}
