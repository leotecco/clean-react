import { Login } from '@/presentation/pages'
import { makeRemoteAuthentication } from '@/main/factories/usecases/authentication/remote-authentication-factory'
import { makeLocalSaveAccessToken } from '@/main/factories/usecases/save-access-token/local-save-access-token'
import { makeLoginValidation } from './login-validation-factory'

export const makeLogin = (): JSX.Element => {
  return <Login
    validation={makeLoginValidation()}
    authentication={makeRemoteAuthentication()}
    saveAccessToken={makeLocalSaveAccessToken()}
  />
}
