import React, { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import Styles from './login-styles.scss'

import { type Authentication, type UpdateCurrentAccount } from '@/domain/usecases'
import { Footer, FormStatus, Input, LoginHeader, SubmitButton } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { type Validation } from '@/presentation/protocols/validation'

type Props = {
  validation: Validation
  authentication: Authentication
  updateCurrentAccount: UpdateCurrentAccount
}

const Login: React.FC<Props> = ({ validation, authentication, updateCurrentAccount }) => {
  const navigate = useNavigate()

  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })

  useEffect(() => {
    const { email, password } = state

    const formData = { email, password }

    const emailError = validation.validate('email', formData)
    const passwordError = validation.validate('password', formData)

    setState((state) => ({
      ...state,
      emailError,
      passwordError,
      isFormInvalid: !!emailError || !!passwordError
    }))
  }, [state.email, state.password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    try {
      if (state.isLoading || state.isFormInvalid) {
        return
      }

      setState((state) => ({ ...state, isLoading: true }))

      const account = await authentication.auth({ email: state.email, password: state.password })

      await updateCurrentAccount.save(account)

      navigate('/', { replace: true })
    } catch (error) {
      setState((state) => ({ ...state, isLoading: false, mainError: error.message }))
    }
  }

  return (
    <div className={Styles.loginWrap}>
      <LoginHeader />

      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form} data-testid="form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <Input type="email" name="email" placeholder='Digite seu e-mail' />

          <Input type="password" name="password" placeholder='Digite sua senha' />

          <SubmitButton text="Entrar" />

          <Link to="/signup" className={Styles.link} data-testid="signup-link" replace>Criar conta</Link>

          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  )
}

export default Login
