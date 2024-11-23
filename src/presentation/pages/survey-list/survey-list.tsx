import React from 'react'

import { Footer, Header, Icon, IconName } from '@/presentation/components'

import Styles from './survey-list-styles.scss'

const SurveyList: React.FC = () => {
  return (
    <div className={Styles.surveyListWrap}>
      <Header />

      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul>
          <li>
            <div className={Styles.surveyContent}>
              <Icon iconName={IconName.thumbUp} className={Styles.iconWrap} />

              <time>
                <span className={Styles.day}>15</span>
                <span className={Styles.month}>11</span>
                <span className={Styles.year}>2024</span>
              </time>

              <p>Qual é o seu framework Web favorito?</p>
            </div>
            <footer>Ver resultado</footer>
          </li>
        </ul>
      </div>

      <Footer />
    </div>
  )
}

export default SurveyList
