import { RenderResult, fireEvent, render } from '@testing-library/react'
import Input from './input'
import FormContext from '@/presentation/contexts/form/form-context'
import { faker } from '@faker-js/faker'

const makeSut = (fieldName: string): RenderResult => {
  return render(<FormContext.Provider value={{ state: {} }}>
      <Input name={fieldName} />
    </FormContext.Provider>
  )
}

describe('Input Component', () => {
  test('Should begin with readOnly', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const input = sut.getByTestId(field) as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })

  test('Should remove readOnly on focus', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const input = sut.getByTestId(field) as HTMLInputElement
    fireEvent.focus(input)
    expect(input.readOnly).toBe(false)
  })
})
