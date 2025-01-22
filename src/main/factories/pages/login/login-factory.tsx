import { makeRemoteAuthentication } from '@/main/factories/usecases'
import { Login } from '@/presentation/pages'
import { makeLoginValidation } from './login-validation-factory'

export const makeLogin = (): JSX.Element => {
  return <Login
    validation={makeLoginValidation()}
    authentication={makeRemoteAuthentication()}
  />
}
