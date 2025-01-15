import { faker } from '@faker-js/faker'

import { fireEvent, screen } from '@testing-library/react'

export const testStatusForField = (fieldName: string, validationError: string = ''): void => {
  const wrap = screen.getByTestId(`${fieldName}-wrap`)
  const field = screen.getByTestId(`${fieldName}`)
  const label = screen.getByTestId(`${fieldName}-label`)
  expect(wrap.getAttribute('data-status')).toBe(validationError ? 'invalid' : 'valid')
  expect(field.title).toBe(validationError)
  expect(label.title).toBe(validationError)
}

export const populateField = (fieldName, value = faker.word.words()): void => {
  const input = screen.getByTestId(fieldName)
  fireEvent.input(input, { target: { value } })
}

export const testElementExists = (elementTestId: string): void => {
  const element = screen.getByTestId(elementTestId)
  expect(element).toBeTruthy()
}

export const testElementText = (elementTestId: string, text: string): void => {
  const element = screen.getByTestId(elementTestId)
  expect(element.textContent).toBe(text)
}

export const testChildCount = (elementTestId: string, count: number): void => {
  const element = screen.getByTestId(elementTestId)
  expect(element.childElementCount).toBe(count)
}
