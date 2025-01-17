import React from 'react'

import { Icon, IconName } from '@/presentation/components'
import Styles from './survey-item-styles.scss'

const SurveyItem: React.FC = () => {
  return (
    <li className={Styles.surveyItemWrap}>
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
  )
}

export default SurveyItem
