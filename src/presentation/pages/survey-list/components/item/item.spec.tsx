import { render, screen } from '@testing-library/react'

import { mockLoadSurveyListModel } from '@/domain/test'
import SurveyItem from './item'
import { IconName } from '@/presentation/components'

const makeSut = (survey = mockLoadSurveyListModel()): void => {
  render(<SurveyItem survey={survey} />)
}

describe('SurveyItem Component', () => {
  test('Should render with correct values', () => {
    const survey = Object.assign(mockLoadSurveyListModel(), {
      didAnswer: true,
      date: new Date('2020-01-10T00:00:00')
    })

    makeSut(survey)

    expect(screen.getByTestId('icon')).toHaveProperty('src', `http://localhost${IconName.thumbUp}`)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('10')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2020')
  })

  test('Should render with correct values', () => {
    const survey = Object.assign(mockLoadSurveyListModel(), {
      didAnswer: false,
      date: new Date('2019-05-03T00:00:00')
    })

    makeSut(survey)

    expect(screen.getByTestId('icon')).toHaveProperty('src', `http://localhost${IconName.thumbDown}`)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('03')
    expect(screen.getByTestId('month')).toHaveTextContent('mai')
    expect(screen.getByTestId('year')).toHaveTextContent('2019')
  })
})
