import React, { useContext } from 'react'

import Context from '@/presentation/contexts/form/form-context'

import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { errorState } = useContext(Context)
  const error = errorState[props.name]

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false
  }

  const getStatus = (): string => {
    return '🔴'
  }

  const getTitle = (): string => {
    return error
  }

  return (
    <div className={Styles.inputWrap}>
      <input {...props} readOnly onFocus={handleFocus}/>
      <span title={getTitle()} className={Styles.status} data-testid={`${props.name}-status`}>{getStatus()}</span>
    </div>
  )
}

export default Input
