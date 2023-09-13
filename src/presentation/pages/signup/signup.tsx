import React, { useEffect, useState } from 'react'

import Styles from './signup-styles.scss'

import { type Validation } from '@/presentation/protocols/validation'
import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'

type Props = {
  validation: Validation
}

const Signup: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    name: '',
    nameError: '',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    passwordConfirmationError: 'Campo obrigatório',
    mainError: ''
  })

  useEffect(() => {
    setState((state) => ({
      ...state,
      nameError: validation.validate('name', state.name)
    }))
  }, [state.name])

  return (
    <div className={Styles.signup}>
      <LoginHeader />

      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form}>
          <h2>Criar conta</h2>
          <Input type="text" name="name" placeholder='Digite seu nome' />

          <Input type="email" name="email" placeholder='Digite seu e-mail' />

          <Input type="password" name="password" placeholder='Digite sua senha' />

          <Input type="password" name="passwordConfirmation" placeholder='Repita sua senha' />

          <button type="submit" disabled className={Styles.submit} data-testid="submit">Entrar</button>

          <a href="/login" className={Styles.link} data-testid="signup">Voltar para login</a>

          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  )
}

export default Signup
