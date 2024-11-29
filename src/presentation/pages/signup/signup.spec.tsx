import { fireEvent, render, waitFor, type RenderResult } from '@testing-library/react'

import { AddAccountSpy, Helper, ValidationStub } from '@/presentation/test'

import { EmailInUseError } from '@/domain/errors'
import { type AccountModel } from '@/domain/models'
import { SignUp } from '@/presentation/pages'
import { faker } from '@faker-js/faker'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'

type SutParams = {
  validationError: string
}

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: (account: AccountModel) => void
  router: ReturnType<typeof createMemoryRouter>
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError

  const addAccountSpy = new AddAccountSpy()

  const setCurrentAccountMock = jest.fn()

  const routes = [
    { path: '/', element: <>Home</> },
    { path: '/login', element: <>Login</> },
    { path: '/signup', element: <SignUp validation={validationStub} addAccount={addAccountSpy} /> }
  ]
  const router = createMemoryRouter(routes, {
    initialEntries: ['/signup'],
    initialIndex: 0
  })

  const sut = render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <RouterProvider router={router} />
    </ApiContext.Provider>
  )

  return { sut, addAccountSpy, setCurrentAccountMock, router }
}

const simulateValidSubmit = (sut: RenderResult, name = faker.word.words(), email = faker.internet.email(), password = faker.internet.password()): void => {
  Helper.populateField(sut, 'name', name)
  Helper.populateField(sut, 'email', email)
  Helper.populateField(sut, 'password', password)
  Helper.populateField(sut, 'passwordConfirmation', password)

  const submitButton = sut.getByTestId('submit') as HTMLButtonElement
  fireEvent.click(submitButton)
}

describe('SignUp Component', () => {
  test('Should start with initial state', () => {
    const validationError = faker.word.words()
    const { sut } = makeSut({ validationError })

    Helper.testChildCount(sut, 'error-wrap', 0)

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)

    Helper.testStatusForField(sut, 'name', validationError)
    Helper.testStatusForField(sut, 'email', validationError)
    Helper.testStatusForField(sut, 'password', validationError)
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError)
  })

  test('Should show name error if Validation fails', () => {
    const validationError = faker.word.words()
    const { sut } = makeSut({ validationError })

    Helper.populateField(sut, 'name')

    Helper.testStatusForField(sut, 'name', validationError)
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

  test('Should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.word.words()
    const { sut } = makeSut({ validationError })

    Helper.populateField(sut, 'passwordConfirmation')

    Helper.testStatusForField(sut, 'passwordConfirmation', validationError)
  })

  test('Should show valid name if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut, 'name')
  })

  test('Should show valid email if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut, 'email')
  })

  test('Should show valid password if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut, 'password')
  })

  test('Should show valid passwordConfirmation if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testStatusForField(sut, 'passwordConfirmation')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'name')
    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')
    Helper.populateField(sut, 'passwordConfirmation')

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
    const { sut, addAccountSpy } = makeSut()
    const name = faker.internet.email()
    const email = faker.internet.email()
    const password = faker.internet.password()

    simulateValidSubmit(sut, name, email, password)

    await waitFor(() => sut.getByText('Home'))

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('Should call AddAccount only once', async () => {
    const { sut, addAccountSpy } = makeSut()

    simulateValidSubmit(sut)
    simulateValidSubmit(sut)

    await waitFor(() => sut.getByText('Home'))

    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('Should not call AddAccount if form is invalid', () => {
    const validationError = faker.word.words()
    const { sut, addAccountSpy } = makeSut({ validationError })

    simulateValidSubmit(sut)

    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { sut, addAccountSpy } = makeSut()
    const error = new EmailInUseError()

    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)

    simulateValidSubmit(sut)

    await waitFor(() => {
      Helper.testElementText(sut, 'main-error', error.message)
      Helper.testChildCount(sut, 'error-wrap', 1)
    })
  })

  test('Should call setCurrentAccount on success', async () => {
    const { sut, addAccountSpy, setCurrentAccountMock, router } = makeSut()

    simulateValidSubmit(sut)

    await waitFor(() => sut.getByTestId('form'))

    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    expect(router.state.location.pathname).toBe('/')
  })

  test('Should go to login page', async () => {
    const { sut, router } = makeSut()

    const login = sut.getByTestId('login-link')

    fireEvent.click(login)

    expect(router.state.location.pathname).toBe('/login')
  })
})
