import React, { useState } from 'react'

import Styles from './login-styles.scss'

import {
  LoginHeader,
  Footer,
  Input,
  FormStatus
} from '@/presentation/components'

import Context from '@/presentation/contexts/form/form-context'

const Login: React.FC = () => {
  const [state] = useState({
    isLoading: false
  })

  const [errorState] = useState({
    main: '',
    email: 'Campo obrigatorio',
    password: 'Campo obrigatorio'
  })

  return (
    <div className={Styles.login}>
      <LoginHeader />

      <Context.Provider value={{ state, errorState }}>
        <form className={Styles.form}>
          <h2>Login</h2>

          <Input type="email" name="email" placeholder='Digite seu e-mail' />

          <Input type="password" name="password" placeholder='Digite sua senha' />

          <button type="submit" className={Styles.submit} data-testid="submit" disabled>Entrar</button>

          <span className={Styles.link}>Criar conta</span>

          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  )
}

export default Login
