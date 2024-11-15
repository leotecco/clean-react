import React from 'react'

import Styles from './survey-list-styles.scss'
import { Footer, Logo } from '@/presentation/components'

const SurveyList: React.FC = () => {
  return (
    <div className={Styles.surveyListWrap}>
      <header className={Styles.headerWrap}>
        <div className={Styles.headerContent}>
          <Logo />

          <div className={Styles.logoutWrap}>
            <span>Leonardo</span>
            <a href="#">Sair</a>
          </div>
        </div>
      </header>

      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul>
          <li>
            <div className={Styles.surveyContent}>
              <time>
                <span className={Styles.day}>15</span>
                <span className={Styles.month}>11</span>
                <span className={Styles.year}>2024</span>
              </time>

              <p>Qual é o seu framework Web favorito?</p>
            </div>
            <footer>Ver resultado</footer>
          </li>
          <li>
            <div className={Styles.surveyContent}>
              <time>
                <span className={Styles.day}>15</span>
                <span className={Styles.month}>11</span>
                <span className={Styles.year}>2024</span>
              </time>

              <p>Qual é o seu framework Web favorito?</p>
            </div>
            <footer>Ver resultado</footer>
          </li>
          <li>
            <div className={Styles.surveyContent}>
              <time>
                <span className={Styles.day}>15</span>
                <span className={Styles.month}>11</span>
                <span className={Styles.year}>2024</span>
              </time>

              <p>Qual é o seu framework Web favorito?</p>
            </div>
            <footer>Ver resultado</footer>
          </li>
          <li>
            <div className={Styles.surveyContent}>
              <time>
                <span className={Styles.day}>15</span>
                <span className={Styles.month}>11</span>
                <span className={Styles.year}>2024</span>
              </time>

              <p>Qual é o seu framework Web favorito?</p>
            </div>
            <footer>Ver resultado</footer>
          </li>
          <li>
            <div className={Styles.surveyContent}>
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
