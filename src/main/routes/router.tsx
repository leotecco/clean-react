import React from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { makeLogin } from '@/main/factories/pages/login/login-factory'
import { makeSignUp } from '@/main/factories/pages/signup/signup-factory'
import { ApiContext } from '@/presentation/contexts'
import { SurveyList } from '@/presentation/pages'
import { getCurrenctAccountAdapter, setCurrenctAccountAdapter } from '../adapters/current-account-adapter'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider value={{ setCurrentAccount: setCurrenctAccountAdapter, getCurrentAccount: getCurrenctAccountAdapter }}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={makeLogin()} />
            <Route path="signup" element={makeSignUp()} />
            <Route path="/" element={<SurveyList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default Router
