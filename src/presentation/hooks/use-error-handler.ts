import { AccessDeniedError } from '@/domain/errors'
import { useLogout } from '@/presentation/hooks'

type CallbackType = (error: Error) => void
type ResultType = (error: Error) => void

export const useErrorHandler = (callback: CallbackType): ResultType => {
  const logout = useLogout()

  return (error: Error): void => {
    if (error instanceof AccessDeniedError) {
      logout()
      return
    }

    callback(error)
  }
}
