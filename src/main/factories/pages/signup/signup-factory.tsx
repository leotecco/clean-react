import { SignUp } from '@/presentation/pages'
import { makeLocalSaveAccessToken } from '@/main/factories/usecases/save-access-token/local-save-access-token'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeRemoteAddAccount } from '../../usecases/add-account/remote-add-account-factory'

export const makeSignUp = (): JSX.Element => {
  return <SignUp
    validation={makeSignUpValidation()}
    addAccount={makeRemoteAddAccount()}
    saveAccessToken={makeLocalSaveAccessToken()}
  />
}
