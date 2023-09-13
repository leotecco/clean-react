import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { makeLogin } from '@/main/factories/pages/login/login-factory'
import { SignUp } from '@/presentation/pages'

const Router: React.FC = () => {
  return <BrowserRouter>
    <Routes>
      <Route path='/'>
        <Route path="login" element={makeLogin()} />
        <Route path="signup" element={<SignUp />} />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default Router
