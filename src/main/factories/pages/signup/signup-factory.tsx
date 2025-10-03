import { makeRemoteAddAccount } from '@/main/factories/usecases'
import { SignUp } from '@/presentation/pages'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUp = (): JSX.Element => {
  return <SignUp
    validation={makeSignUpValidation()}
    addAccount={makeRemoteAddAccount()}
  />
}
