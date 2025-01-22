import React from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { getCurrenctAccountAdapter, setCurrenctAccountAdapter } from '@/main/adapters'
import { makeLogin, makeSignUp, makeSurveyList } from '@/main/factories/pages'
import { PrivateRoute } from '@/presentation/components'
import { ApiContext } from '@/presentation/contexts'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider value={{ setCurrentAccount: setCurrenctAccountAdapter, getCurrentAccount: getCurrenctAccountAdapter }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route element={makeSurveyList()} index />
          </Route>

          <Route path="login" element={makeLogin()} />
          <Route path="signup" element={makeSignUp()} />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default Router
