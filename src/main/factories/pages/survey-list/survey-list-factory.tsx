import { makeRemoteLoadSurveyList } from '@/main/factories/usecases'
import { SurveyList } from '@/presentation/pages'

export const makeSurveyList = (): JSX.Element => {
  return <SurveyList loadSurveyList={makeRemoteLoadSurveyList()} />
}
