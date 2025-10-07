import { faker } from '@faker-js/faker'
import * as FormHelper from '../support/form-helpers'
import * as Helper from '../support/helpers'
import * as Http from '../support/signup-mocks'

const populateFields = (): void => {
  cy.getByTestId('name').focus()
  cy.getByTestId('name').type(faker.person.fullName())

  cy.getByTestId('email').focus()
  cy.getByTestId('email').type(faker.internet.email())

  const password = faker.string.alphanumeric(5)

  cy.getByTestId('password').focus()
  cy.getByTestId('password').type(password)

  cy.getByTestId('passwordConfirmation').focus()
  cy.getByTestId('passwordConfirmation').type(password)
}

const simulateValidSubmit = (): void => {
  populateFields()

  cy.getByTestId('submit').click()
}

describe('SignUp', () => {
  beforeEach(() => {
    cy.visit('signup')
  })

  it('Should load with correct initial state', () => {
    FormHelper.testInputStatus('name', 'Campo obrigatório')
    cy.getByTestId('email').should('have.attr', 'readOnly')

    FormHelper.testInputStatus('email', 'Campo obrigatório')
    cy.getByTestId('email').should('have.attr', 'readOnly')

    FormHelper.testInputStatus('password', 'Campo obrigatório')
    cy.getByTestId('password').should('have.attr', 'readOnly')

    FormHelper.testInputStatus('passwordConfirmation', 'Campo obrigatório')
    cy.getByTestId('password').should('have.attr', 'readOnly')

    cy.getByTestId('submit').should('have.attr', 'disabled')

    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error if form is invalid', () => {
    cy.getByTestId('name').focus()
    cy.getByTestId('name').type(faker.string.alphanumeric(3))
    FormHelper.testInputStatus('name', 'Valor inválido')

    cy.getByTestId('email').focus()
    cy.getByTestId('email').type(faker.word.words())
    FormHelper.testInputStatus('email', 'Valor inválido')

    cy.getByTestId('password').focus()
    cy.getByTestId('password').type(faker.string.alphanumeric(3))
    FormHelper.testInputStatus('password', 'Valor inválido')

    cy.getByTestId('passwordConfirmation').focus()
    cy.getByTestId('passwordConfirmation').type(faker.string.alphanumeric(4))
    FormHelper.testInputStatus('passwordConfirmation', 'Valor inválido')

    cy.getByTestId('submit').should('have.attr', 'disabled')

    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid if form is valid', () => {
    cy.getByTestId('name').focus()
    cy.getByTestId('name').type(faker.person.fullName())
    FormHelper.testInputStatus('name')

    cy.getByTestId('email').focus()
    cy.getByTestId('email').type(faker.internet.email())
    FormHelper.testInputStatus('email')

    const password = faker.string.alphanumeric(5)

    cy.getByTestId('password').focus()
    cy.getByTestId('password').type(password)
    FormHelper.testInputStatus('password')

    cy.getByTestId('passwordConfirmation').focus()
    cy.getByTestId('passwordConfirmation').type(password)
    FormHelper.testInputStatus('passwordConfirmation')

    cy.getByTestId('submit').should('not.have.attr', 'disabled')

    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present UnexpectedError on default error cases', () => {
    Http.mockUnexpectedError()
    simulateValidSubmit()

    FormHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    Helper.testUrl('/signup')
  })

  it('Should present EmailInUseError on 403', () => {
    Http.mockEmailInUseError()
    simulateValidSubmit()

    FormHelper.testMainError('Esse e-mail já está em uso')

    Helper.testUrl('/signup')
  })

  it('Should present save account valid credentials are provided', () => {
    Http.mockOk()
    Http.mockSurveys()
    simulateValidSubmit()

    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('not.exist')

    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('Should prevent multiple submits', () => {
    Http.mockOk()

    populateFields()
    cy.getByTestId('passwordConfirmation').type('{enter}{enter}')

    Helper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    Http.mockOk()

    cy.getByTestId('email').focus()
    cy.getByTestId('email').type(faker.internet.email())
    cy.getByTestId('email').type('{enter}')

    Helper.testHttpCallsCount(0)
  })
})
