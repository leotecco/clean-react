import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { UnexpectedError } from '@/domain/errors'
import { LoadSurveyListSpy } from '@/domain/test'
import SurveyList from './survey-list'

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  render(<SurveyList loadSurveyList={loadSurveyListSpy} />)

  return {
    loadSurveyListSpy
  }
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

  test('Should render error on failure', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error)

    makeSut(loadSurveyListSpy)

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(error.message)
      expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
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
