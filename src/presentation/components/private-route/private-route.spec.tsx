import { render } from '@testing-library/react'

import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router-dom'

import { mockAccountModel } from '@/domain/test'
import ApiContext from '@/presentation/contexts/api/api-context'
import PrivateRoute from './private-route'

type SutTypes = {
  router: ReturnType<typeof createMemoryRouter>
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <PrivateRoute />,
      children: [
        { path: '', element: <>SurveyList</> }
      ]
    },
    { path: '/login', element: <>Login</> }
  ]

  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
    initialIndex: 0
  })

  render(<ApiContext.Provider value={{ getCurrentAccount: () => account }}><RouterProvider router={router} /></ApiContext.Provider>)

  return {
    router
  }
}

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const { router } = makeSut(null)

    expect(router.state.location.pathname).toBe('/login')
  })

  test('Should render current component if token is not empty', () => {
    const { router } = makeSut()

    expect(router.state.location.pathname).toBe('/')
  })
})
