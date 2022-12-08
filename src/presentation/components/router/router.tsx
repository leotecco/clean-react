import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Login } from '@/presentation/pages'

const Router: React.FC = () => {
  return <BrowserRouter>
    <Routes>
      <Route path='/'>
        <Route path="login" element={<Login validation={{ validate: () => '' }} authentication={{ auth: async () => ({ accessToken: '' }) }} />} />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default Router
