import React, { useContext } from 'react'

import { type LoadSurveyListModel } from '@/domain/usecases'
import { SurveyContext, SurveyItem, SurveyItemEmpty } from '@/presentation/pages/survey-list/components'
import Styles from './list-styles.scss'

const List: React.FC = () => {
  const { state } = useContext(SurveyContext)

  return (
    <ul className={Styles.listWrap} data-testid="survey-list">
      {state.surveys.length
        ? state.surveys.map((survey: LoadSurveyListModel) => <SurveyItem survey={survey} key={survey.id} />)
        : <SurveyItemEmpty />}
    </ul>
  )
}

export default List
