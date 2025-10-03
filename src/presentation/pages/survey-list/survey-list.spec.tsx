import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { LoadSurveyListSpy, mockAccountModel } from '@/domain/test'
import { ApiContext } from '@/presentation/contexts'
import { createMemoryRouter, type RouteObject, RouterProvider } from 'react-router-dom'
import SurveyList from './survey-list'
import { type AccountModel } from '@/domain/models'

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void
  router: ReturnType<typeof createMemoryRouter>
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  const routes: RouteObject[] = [
    { path: '/', element: <SurveyList loadSurveyList={loadSurveyListSpy} /> },
    { path: '/login', element: <>Login</> }
  ]

  const router = createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })
  const setCurrentAccountMock = jest.fn()

  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => mockAccountModel() }}>
      <RouterProvider router={router} />
    </ApiContext.Provider>
  )

  return { setCurrentAccountMock, router, loadSurveyListSpy }
}

describe('SurveyList Component', () => {
  test('Should present 4 empty items on start', async () => {
    makeSut()

    const surveyList = screen.getByTestId('survey-list')

    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()

    await waitFor(() => surveyList)
  })

  test('Should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut()

    expect(loadSurveyListSpy.callCount).toBe(1)

    await waitFor(() => screen.getByRole('heading'))
  })

  test('Should render SurveyItem on success', async () => {
    makeSut()

    const surveyList = screen.getByTestId('survey-list')

    await waitFor(() => {
      expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(3)
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    })
  })

  test('Should render error on UnexpectedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error)

    makeSut(loadSurveyListSpy)

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(error.message)
      expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
    })
  })

  test('Should logout on AccessDeniedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(new AccessDeniedError())

    const { setCurrentAccountMock, router } = makeSut(loadSurveyListSpy)

    await waitFor(() => {
      expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
      expect(router.state.location.pathname).toBe('/login')
    })
  })

  test('Should call LoadSurveyList on reload', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(new UnexpectedError())

    makeSut(loadSurveyListSpy)

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('reload'))
    expect(loadSurveyListSpy.callCount).toBe(1)

    await waitFor(() => {
      expect(screen.getByTestId('survey-list').querySelectorAll('li.surveyItemWrap')).toHaveLength(3)
    })
  })
})
