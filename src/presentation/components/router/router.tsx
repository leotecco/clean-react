import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

type Props = {
  makeLogin: () => JSX.Element
}

const Router: React.FC<Props> = ({ makeLogin }) => {
  const login = makeLogin()

  return <BrowserRouter>
    <Routes>
      <Route path='/'>
        <Route path="login" element={login} />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default Router
