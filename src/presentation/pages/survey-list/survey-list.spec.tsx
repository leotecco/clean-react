import { render, screen, waitFor } from '@testing-library/react'

import { type SurveyModel } from '@/domain/models'
import { mockSurveyListModel } from '@/domain/test'
import { type LoadSurveyList } from '@/domain/usecases'
import SurveyList from './survey-list'

class LoadSurveyListSpy implements LoadSurveyList {
  callCount = 0
  surveys = mockSurveyListModel()

  async loadAll (): Promise<SurveyModel[]> {
    this.callCount++

    return this.surveys
  }
}

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyListSpy = new LoadSurveyListSpy()

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

    await waitFor(() => surveyList)
  })

  test('Should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut()

    expect(loadSurveyListSpy.callCount).toBe(1)

    await waitFor(() => screen.getByRole('heading'))
  })

  test('Should render SurveyItem on succes', async () => {
    makeSut()

    const surveyList = screen.getByTestId('survey-list')

    await waitFor(() => {
      expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(3)
    })
  })
})
