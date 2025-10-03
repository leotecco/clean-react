export type LoadSurveyListModel = {
  id: string
  question: string
  date: Date
  didAnswer: boolean
}

export interface LoadSurveyList {
  loadAll: () => Promise<LoadSurveyListModel[]>
}
