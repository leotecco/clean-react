import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { Helper, ValidationStub } from '@/presentation/test'

import { EmailInUseError } from '@/domain/errors'
import { AddAccountSpy } from '@/domain/test'
import { type AddAccountModel } from '@/domain/usecases'
import { ApiContext } from '@/presentation/contexts'
import { SignUp } from '@/presentation/pages'
import { faker } from '@faker-js/faker'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

type SutParams = {
  validationError: string
}

type SutTypes = {
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: (account: AddAccountModel) => void
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

  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <RouterProvider router={router} />
    </ApiContext.Provider>
  )

  return { addAccountSpy, setCurrentAccountMock, router }
}

const simulateValidSubmit = (name = faker.word.words(), email = faker.internet.email(), password = faker.internet.password()): void => {
  Helper.populateField('name', name)
  Helper.populateField('email', email)
  Helper.populateField('password', password)
  Helper.populateField('passwordConfirmation', password)

  const submitButton = screen.getByTestId('submit')
  fireEvent.click(submitButton)
}

describe('SignUp Component', () => {
  test('Should start with initial state', () => {
    const validationError = faker.word.words()
    makeSut({ validationError })

    expect(screen.getByTestId('error-wrap').children).toHaveLength(0)
    expect(screen.getByTestId('submit')).toBeDisabled()

    Helper.testStatusForField('name', validationError)
    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
    Helper.testStatusForField('passwordConfirmation', validationError)
  })

  test('Should show name error if Validation fails', () => {
    const validationError = faker.word.words()
    makeSut({ validationError })

    Helper.populateField('name')

    Helper.testStatusForField('name', validationError)
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

  test('Should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.word.words()
    makeSut({ validationError })

    Helper.populateField('passwordConfirmation')

    Helper.testStatusForField('passwordConfirmation', validationError)
  })

  test('Should show valid name if Validation succeeds', () => {
    makeSut()
    Helper.populateField('name')
    Helper.testStatusForField('name')
  })

  test('Should show valid email if Validation succeeds', () => {
    makeSut()
    Helper.populateField('email')
    Helper.testStatusForField('email')
  })

  test('Should show valid password if Validation succeeds', () => {
    makeSut()
    Helper.populateField('password')
    Helper.testStatusForField('password')
  })

  test('Should show valid passwordConfirmation if Validation succeeds', () => {
    makeSut()
    Helper.populateField('passwordConfirmation')
    Helper.testStatusForField('passwordConfirmation')
  })

  test('Should enable submit button if form is valid', () => {
    makeSut()

    Helper.populateField('name')
    Helper.populateField('email')
    Helper.populateField('password')
    Helper.populateField('passwordConfirmation')

    expect(screen.getByTestId('submit')).toBeEnabled()
  })

  test('Should show spinner on submit', async () => {
    makeSut()

    simulateValidSubmit()

    expect(screen.queryByTestId('spinner')).toBeInTheDocument()

    await waitFor(() => screen.getByText('Home'))
  })

  test('Should call Authentication with correct values', async () => {
    const { addAccountSpy } = makeSut()
    const name = faker.internet.email()
    const email = faker.internet.email()
    const password = faker.internet.password()

    simulateValidSubmit(name, email, password)

    await waitFor(() => screen.getByText('Home'))

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('Should call AddAccount only once', async () => {
    const { addAccountSpy } = makeSut()

    simulateValidSubmit()
    simulateValidSubmit()

    await waitFor(() => screen.getByText('Home'))

    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('Should not call AddAccount if form is invalid', () => {
    const validationError = faker.word.words()
    const { addAccountSpy } = makeSut({ validationError })

    simulateValidSubmit()

    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { addAccountSpy } = makeSut()
    const error = new EmailInUseError()

    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)

    simulateValidSubmit()

    await waitFor(() => {
      expect(screen.getByTestId('main-error')).toHaveTextContent(error.message)
      expect(screen.getByTestId('error-wrap').children).toHaveLength(1)
    })
  })

  test('Should call setCurrentAccount on success', async () => {
    const { addAccountSpy, setCurrentAccountMock, router } = makeSut()

    simulateValidSubmit()

    await waitFor(() => screen.getByTestId('form'))

    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    expect(router.state.location.pathname).toBe('/')
  })

  test('Should go to login page', async () => {
    const { router } = makeSut()

    const login = screen.getByTestId('login-link')

    fireEvent.click(login)

    expect(router.state.location.pathname).toBe('/login')
  })
})
