import React from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { makeLogin } from '@/main/factories/pages/login/login-factory'
import { makeSignUp } from '@/main/factories/pages/signup/signup-factory'
import { SurveyList } from '@/presentation/pages'

const Router: React.FC = () => {
  return <BrowserRouter>
    <Routes>
      <Route path='/'>
        <Route path="login" element={makeLogin()} />
        <Route path="signup" element={makeSignUp()} />
        <Route path="/" element={<SurveyList />} />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default Router
