import { makeLocalUpdateCurrentAccount } from '@/main/factories/usecases/update-current-account/local-update-current-account-factory'
import { SignUp } from '@/presentation/pages'
import { makeRemoteAddAccount } from '../../usecases/add-account/remote-add-account-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUp = (): JSX.Element => {
  return <SignUp
    validation={makeSignUpValidation()}
    addAccount={makeRemoteAddAccount()}
    updateCurrentAccount={makeLocalUpdateCurrentAccount()}
  />
}
