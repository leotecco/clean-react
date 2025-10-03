import React, { useEffect, useState } from 'react'

import { type LoadSurveyList, type LoadSurveyListModel } from '@/domain/usecases'
import { Footer, Header } from '@/presentation/components'
import { useErrorHandler } from '@/presentation/hooks'
import { Error, SurveyContext, SurveyListItem } from '@/presentation/pages/survey-list/components'
import Styles from './survey-list-styles.scss'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  const [state, setState] = useState({
    surveys: [] as LoadSurveyListModel[],
    error: '',
    reload: false
  })

  const handleError = useErrorHandler((error: Error) => {
    setState((state) => ({ ...state, error: error.message }))
  })

  useEffect(() => {
    loadSurveyList.loadAll()
      .then(surveys => { setState((state) => ({ ...state, surveys })) })
      .catch(handleError)
  }, [state.reload])

  return (
    <div className={Styles.surveyListWrap}>
      <Header />

      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>

        <SurveyContext.Provider value={{ state, setState }}>
          {state.error ? <Error /> : <SurveyListItem />}
        </SurveyContext.Provider>
      </div>

      <Footer />
    </div>
  )
}

export default SurveyList
