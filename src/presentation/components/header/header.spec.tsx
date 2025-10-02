import { type AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { Header } from '@/presentation/components'
import { ApiContext } from '@/presentation/contexts'
import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, type RouteObject, RouterProvider } from 'react-router-dom'

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void
  router: ReturnType<typeof createMemoryRouter>
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const routes: RouteObject[] = [
    { path: '/', element: <Header /> },
    { path: '/login', element: <>Login</> }
  ]

  const router = createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })
  const setCurrentAccountMock = jest.fn()

  render(
      <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => account }}>
        <RouterProvider router={router} />
      </ApiContext.Provider>
  )

  return { router, setCurrentAccountMock }
}

describe('Header Component', () => {
  test('Should call setCurrentAccount with null', () => {
    const { router, setCurrentAccountMock } = makeSut()

    fireEvent.click(screen.getByTestId('logout'))

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(router.state.location.pathname).toBe('/login')
  })

  test('Should render username correctly', () => {
    const account = mockAccountModel()

    makeSut(account)

    expect(screen.getByTestId('username')).toHaveTextContent(account.name)
  })
})
