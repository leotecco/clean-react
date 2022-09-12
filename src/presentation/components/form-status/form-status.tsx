import React, { useContext } from 'react'

import Spinner from '../spinner/spinner'
import Context from '@/presentation/contexts/form/form-context'

import Styles from './form-status-styles.scss'

const FormStatus: React.FC = () => {
  const { state, errorState } = useContext(Context)

  return (
    <div className={Styles.errorWrap} data-testid="error-wrap">
      {state.isLoading && <Spinner className={Styles.spinner} />}
      {errorState.main && <span className={Styles.error}>{errorState.main}</span>}
    </div>
  )
}

export default FormStatus
