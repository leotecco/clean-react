import React, { useContext, useEffect, useState } from 'react'

import { AccessDeniedError } from '@/domain/errors'
import { type LoadSurveyList, type LoadSurveyListModel } from '@/domain/usecases'
import { Footer, Header } from '@/presentation/components'
import { ApiContext } from '@/presentation/contexts'
import { Error, SurveyContext, SurveyListItem } from '@/presentation/pages/survey-list/components'
import { useNavigate } from 'react-router-dom'
import Styles from './survey-list-styles.scss'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  const navigate = useNavigate()
  const { setCurrentAccount } = useContext(ApiContext)
  const [state, setState] = useState({
    surveys: [] as LoadSurveyListModel[],
    error: '',
    reload: false
  })

  useEffect(() => {
    loadSurveyList.loadAll()
      .then(surveys => { setState((state) => ({ ...state, surveys })) })
      .catch(error => {
        if (error instanceof AccessDeniedError) {
          setCurrentAccount(undefined)
          navigate('/login')
          return
        }

        setState((state) => ({ ...state, error: error.message }))
      })
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
