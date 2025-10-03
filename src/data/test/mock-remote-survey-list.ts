import { faker } from '@faker-js/faker'

import { type RemoteLoadSurveyListModel } from '@/data/usecases'

export const mockRemoteLoadSurveyListModel = (): RemoteLoadSurveyListModel => ({
  id: faker.string.uuid(),
  question: faker.word.words(),
  didAnswer: faker.datatype.boolean(),
  date: faker.date.recent().toISOString()
})

export const mockRemoteLoadSurveyListModels = (): RemoteLoadSurveyListModel[] => ([
  mockRemoteLoadSurveyListModel(),
  mockRemoteLoadSurveyListModel(),
  mockRemoteLoadSurveyListModel()
])
