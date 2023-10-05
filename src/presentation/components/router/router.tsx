import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { makeLogin } from '@/main/factories/pages/login/login-factory'
import { makeSignUp } from '@/main/factories/pages/signup/signup-factory'

const Router: React.FC = () => {
  return <BrowserRouter>
    <Routes>
      <Route path='/'>
        <Route path="login" element={makeLogin()} />
        <Route path="signup" element={makeSignUp()} />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default Router
