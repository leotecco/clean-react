import React, { memo } from 'react'

import Logo from '../logo/logo'

import Styles from './login-header-styles.scss'

console.log(Styles)

const LoginHeader: React.FC = () => {
  return (
    <header className={Styles.loginHeader}>
      <Logo />
      <h1>4Dev - Enquetes para Programadores</h1>
    </header>
  )
}

export default memo(LoginHeader)
