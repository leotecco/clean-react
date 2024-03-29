import React, { useContext } from 'react'

import Context from '@/presentation/contexts/form/form-context'

import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props) => {
  const { state, setState } = useContext(Context)
  const error = state[`${props.name}Error`]

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState((state) => ({ ...state, [event.target.name]: event.target.value }))
  }

  const getStatus = (): string => {
    return error ? '🔴' : '🟢'
  }

  const getTitle = (): string => {
    return error || 'Tudo certo!'
  }

  return (
    <div className={Styles.inputWrap}>
      <input {...props} data-testid={props.name} onFocus={handleFocus} onChange={handleChange} readOnly />
      <span title={getTitle()} className={Styles.status} data-testid={`${props.name}-status`}>{getStatus()}</span>
    </div>
  )
}

export default Input
