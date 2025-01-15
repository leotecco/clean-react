import { faker } from '@faker-js/faker'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { InvalidCredentialsError } from '@/domain/errors'
import { type AccountModel } from '@/domain/models'
import { ApiContext } from '@/presentation/contexts'
import { Login } from '@/presentation/pages'
import { AuthenticationSpy, Helper, ValidationStub } from '@/presentation/test'

type SutParams = {
  validationError: string
}

type SutTypes = {
  authenticationSpy: AuthenticationSpy
  router: ReturnType<typeof createMemoryRouter>
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError

  const authenticationSpy = new AuthenticationSpy()

  const setCurrentAccountMock = jest.fn()

  const routes = [
    { path: '/', element: <>Home</> },
    { path: '/signup', element: <>Sign up</> },
    { path: '/login', element: <Login validation={validationStub} authentication={authenticationSpy} /> }
  ]
  const router = createMemoryRouter(routes, {
    initialEntries: ['/login'],
    initialIndex: 0
  })

  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <RouterProvider router={router} />
    </ApiContext.Provider>
  )

  return { authenticationSpy, setCurrentAccountMock, router }
}

const simulateValidSubmit = (email = faker.internet.email(), password = faker.internet.password()): void => {
  Helper.populateField('email', email)
  Helper.populateField('password', password)

  const submitButton = screen.getByTestId('submit')
  fireEvent.click(submitButton)
}

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const validationError = faker.word.words()
    makeSut({ validationError })

    expect(screen.getByTestId('error-wrap').children).toHaveLength(0)
    expect(screen.getByTestId('submit')).toBeDisabled()

    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.word.words()
    makeSut({ validationError })

    Helper.populateField('email')

    Helper.testStatusForField('email', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.word.words()
    makeSut({ validationError })

    Helper.populateField('password')

    Helper.testStatusForField('password', validationError)
  })

  test('Should show valid email state if Validation succeeds', () => {
    makeSut()

    Helper.populateField('email')

    Helper.testStatusForField('email')
  })

  test('Should show valid password state if Validation succeeds', () => {
    makeSut()

    Helper.populateField('password')

    Helper.testStatusForField('password')
  })

  test('Should enable submit button if form is valid', () => {
    makeSut()

    Helper.populateField('email')
    Helper.populateField('password')

    expect(screen.getByTestId('submit')).toBeEnabled()
  })

  test('Should show spinner on submit', async () => {
    makeSut()
    simulateValidSubmit()

    expect(screen.queryByTestId('spinner')).toBeInTheDocument()

    await waitFor(() => screen.getByText('Home'))
  })

  test('Should call Authentication with correct values', async () => {
    const { authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()

    simulateValidSubmit(email, password)

    await waitFor(() => screen.getByText('Home'))

    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('Should call Authentication only once', async () => {
    const { authenticationSpy } = makeSut()

    simulateValidSubmit()
    simulateValidSubmit()

    await waitFor(() => screen.getByText('Home'))

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.word.words()
    const { authenticationSpy } = makeSut({ validationError })

    simulateValidSubmit()

    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()

    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    simulateValidSubmit()

    await waitFor(() => {
      expect(screen.getByTestId('main-error')).toHaveTextContent(error.message)
      expect(screen.getByTestId('error-wrap').children).toHaveLength(1)
    })
  })

  test('Should call setCurrentAccount on success', async () => {
    const { authenticationSpy, setCurrentAccountMock, router } = makeSut()

    simulateValidSubmit()

    await waitFor(() => screen.getByTestId('form'))

    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account)
    expect(router.state.location.pathname).toBe('/')
  })

  test('Should go to signup page', async () => {
    const { router } = makeSut()

    const signup = screen.getByTestId('signup-link')

    fireEvent.click(signup)

    expect(router.state.location.pathname).toBe('/signup')
  })
})
