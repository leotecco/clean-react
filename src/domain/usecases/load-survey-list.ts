import { type SurveyModel } from '@/domain/models'

export type AddAccountParams = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface LoadSurveyList {
  loadAll: () => Promise<SurveyModel[]>
}
