import { faker } from '@faker-js/faker'

import { fireEvent, render, type RenderResult, waitFor } from '@testing-library/react'

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
  sut: RenderResult
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

  const sut = render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <RouterProvider router={router} />
    </ApiContext.Provider>
  )

  return { authenticationSpy, setCurrentAccountMock, router, sut }
}

const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
  Helper.populateField(sut, 'email', email)
  Helper.populateField(sut, 'password', password)

  const submitButton = sut.getByTestId('submit') as HTMLButtonElement
  fireEvent.click(submitButton)
}

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const validationError = faker.word.words()
    const { sut } = makeSut({ validationError })

    Helper.testChildCount(sut, 'error-wrap', 0)

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)

    Helper.testStatusForField(sut, 'email', validationError)
    Helper.testStatusForField(sut, 'password', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.word.words()
    const { sut } = makeSut({ validationError })

    Helper.populateField(sut, 'email')

    Helper.testStatusForField(sut, 'email', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.word.words()
    const { sut } = makeSut({ validationError })

    Helper.populateField(sut, 'password')

    Helper.testStatusForField(sut, 'password', validationError)
  })

  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'email')

    Helper.testStatusForField(sut, 'email')
  })

  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'password')

    Helper.testStatusForField(sut, 'password')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })

  test('Should show spinner on submit', async () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)

    Helper.testElementExists(sut, 'spinner')

    await waitFor(() => sut.getByText('Home'))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()

    simulateValidSubmit(sut, email, password)

    await waitFor(() => sut.getByText('Home'))

    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('Should call Authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()

    simulateValidSubmit(sut)
    simulateValidSubmit(sut)

    await waitFor(() => sut.getByText('Home'))

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.word.words()
    const { sut, authenticationSpy } = makeSut({ validationError })

    simulateValidSubmit(sut)

    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()

    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    simulateValidSubmit(sut)

    await waitFor(() => {
      Helper.testElementText(sut, 'main-error', error.message)
      Helper.testChildCount(sut, 'error-wrap', 1)
    })
  })

  test('Should call setCurrentAccount on success', async () => {
    const { sut, authenticationSpy, setCurrentAccountMock, router } = makeSut()

    simulateValidSubmit(sut)

    await waitFor(() => sut.getByTestId('form'))

    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account)
    expect(router.state.location.pathname).toBe('/')
  })

  test('Should go to signup page', async () => {
    const { sut, router } = makeSut()

    const signup = sut.getByTestId('signup-link')

    fireEvent.click(signup)

    expect(router.state.location.pathname).toBe('/signup')
  })
})
