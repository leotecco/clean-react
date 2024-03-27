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
    setState((state) => ({
      ...state,
      [event.target.name]: event.target.value
    }))
  }

  return (
    <div
      className={Styles.inputWrap}
      data-testid={`${props.name}-wrap`}
      data-status={error ? 'invalid' : 'valid'}
    >
      <input
        {...props}
        title={error}
        placeholder=" "
        data-testid={props.name}
        onFocus={handleFocus}
        onChange={handleChange}
        readOnly
      />
      <label title={error} data-testid={`${props.name}-label`}>
        {props.placeholder}
      </label>
    </div>
  )
}

export default Input
