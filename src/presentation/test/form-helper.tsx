import { faker } from '@faker-js/faker'

import { fireEvent, type RenderResult } from '@testing-library/react'

export const testStatusForField = (sut: RenderResult, fieldName: string, validationError: string = ''): void => {
  const wrap = sut.getByTestId(`${fieldName}-wrap`)
  const field = sut.getByTestId(`${fieldName}`)
  const label = sut.getByTestId(`${fieldName}-label`)
  expect(wrap.getAttribute('data-status')).toBe(validationError ? 'invalid' : 'valid')
  expect(field.title).toBe(validationError)
  expect(label.title).toBe(validationError)
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
