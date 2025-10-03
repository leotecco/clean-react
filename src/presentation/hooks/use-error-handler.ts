import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'
import { AccessDeniedError } from '@/domain/errors'

type CallbackType = (error: Error) => void
type ResultType = (error: Error) => void

export const useErrorHandler = (callback: CallbackType): ResultType => {
  const navigate = useNavigate()
  const { setCurrentAccount } = useContext(ApiContext)

  return (error: Error): void => {
    if (error instanceof AccessDeniedError) {
      setCurrentAccount(undefined)
      navigate('/login')
      return
    }

    callback(error)
  }
}
