import { type LoadSurveyList, type LoadSurveyListModel } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockLoadSurveyListModel = (): LoadSurveyListModel => ({
  id: faker.string.uuid(),
  question: faker.word.words(),
  didAnswer: faker.datatype.boolean(),
  date: faker.date.recent()
})

export const mockLoadSurveyListModels = (): LoadSurveyListModel[] => ([
  mockLoadSurveyListModel(),
  mockLoadSurveyListModel(),
  mockLoadSurveyListModel()
])

export class LoadSurveyListSpy implements LoadSurveyList {
  callCount = 0
  surveys = mockLoadSurveyListModels()

  async loadAll (): Promise<LoadSurveyListModel[]> {
    this.callCount++

    return this.surveys
  }
}
