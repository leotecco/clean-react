import { faker } from '@faker-js/faker'
import { type GetStorage } from '@/data/protocols/cache'

export class GetStorageSpy implements GetStorage {
  key: string
  value = faker.word.words()

  get (key: string): any {
    this.key = key

    return this.value
  }
}
