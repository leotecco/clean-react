import { makeRemoteAuthentication } from '@/main/factories/usecases/authentication/remote-authentication-factory'
import { makeLocalUpdateCurrentAccount } from '@/main/factories/usecases/update-current-account/local-update-current-account-factory'
import { Login } from '@/presentation/pages'
import { makeLoginValidation } from './login-validation-factory'

export const makeLogin = (): JSX.Element => {
  return <Login
    validation={makeLoginValidation()}
    authentication={makeRemoteAuthentication()}
    updateCurrentAccount={makeLocalUpdateCurrentAccount()}
  />
}
