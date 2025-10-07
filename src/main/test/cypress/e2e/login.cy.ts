import { faker } from '@faker-js/faker'
import * as FormHelper from '../utils/form-helpers'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const mockUnexpectedError = (): void => {
  Http.mockServerError(/login/, 'POST')
}

const mockInvalidCredentialsError = (): void => {
  Http.mockUnauthorizedError(/login/)
}

const mockSuccess = (): void => {
  Http.mockOk(/login/, 'POST', 'account')
}

const mockSurveys = (): void => {
  Http.mockOk(/surveys/, 'GET', 'survey-list')
}

const populateFields = (): void => {
  cy.getByTestId('email').focus()
  cy.getByTestId('email').type(faker.internet.email())

  cy.getByTestId('password').focus()
  cy.getByTestId('password').type(faker.string.alphanumeric(5))
}

const simulateValidSubmit = (): void => {
  populateFields()

  cy.getByTestId('submit').click()
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    FormHelper.testInputStatus('email', 'Campo obrigatório')
    cy.getByTestId('email').should('have.attr', 'readOnly')

    FormHelper.testInputStatus('password', 'Campo obrigatório')
    cy.getByTestId('password').should('have.attr', 'readOnly')

    cy.getByTestId('submit').should('have.attr', 'disabled')

    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error if form is invalid', () => {
    cy.getByTestId('email').focus()
    cy.getByTestId('email').type(faker.word.words())
    FormHelper.testInputStatus('email', 'Valor inválido')

    cy.getByTestId('password').focus()
    cy.getByTestId('password').type(faker.string.alphanumeric(3))
    FormHelper.testInputStatus('password', 'Valor inválido')

    cy.getByTestId('submit').should('have.attr', 'disabled')

    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid if form is valid', () => {
    cy.getByTestId('email').focus()
    cy.getByTestId('email').type(faker.internet.email())
    FormHelper.testInputStatus('email')

    cy.getByTestId('password').focus()
    cy.getByTestId('password').type(faker.string.alphanumeric(5))
    FormHelper.testInputStatus('password')

    cy.getByTestId('submit').should('not.have.attr', 'disabled')

    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present UnexpectedError on default error cases', () => {
    mockUnexpectedError()
    simulateValidSubmit()

    FormHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    Helper.testUrl('/login')
  })

  it('Should present InvalidCredentialsError on 401', () => {
    mockInvalidCredentialsError()
    simulateValidSubmit()

    FormHelper.testMainError('Credenciais inválidas')

    Helper.testUrl('/login')
  })

  it('Should present save account valid credentials are provided', () => {
    mockSuccess()
    mockSurveys()
    simulateValidSubmit()

    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('not.exist')

    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('Should prevent multiple submits', () => {
    mockSuccess()

    populateFields()
    cy.getByTestId('password').type('{enter}{enter}')

    Helper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    mockSuccess()

    cy.getByTestId('email').focus()
    cy.getByTestId('email').type(faker.internet.email())
    cy.getByTestId('email').type('{enter}')

    Helper.testHttpCallsCount(0)
  })
})
