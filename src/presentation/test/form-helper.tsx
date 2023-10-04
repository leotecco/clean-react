import { faker } from '@faker-js/faker'

import { fireEvent, type RenderResult } from '@testing-library/react'

export const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

export const populateField = (sut: RenderResult, fieldName, value = faker.word.words()): void => {
  const input = sut.getByTestId(fieldName)
  fireEvent.input(input, { target: { value } })
}

export const testElementExists = (sut: RenderResult, elementTestId: string): void => {
  const element = sut.getByTestId(elementTestId)
  expect(element).toBeTruthy()
}

export const testElementText = (sut: RenderResult, elementTestId: string, text: string): void => {
  const element = sut.getByTestId(elementTestId)
  expect(element.textContent).toBe(text)
}

export const testChildCount = (sut: RenderResult, elementTestId: string, count: number): void => {
  const element = sut.getByTestId(elementTestId)
  expect(element.childElementCount).toBe(count)
}
