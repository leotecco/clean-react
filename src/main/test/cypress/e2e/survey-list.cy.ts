import { faker } from '@faker-js/faker'
import * as Helper from '../support/helpers'
import * as Http from '../support/survey-list-mocks'

describe('Survey List', () => {
  beforeEach(() => {
    Helper.setLocalStorageItem('account', { accessToken: faker.string.uuid(), name: faker.person.fullName() })
  })

  it('Should present error on UnexpectedError', () => {
    Http.mockUnexpectedError()

    cy.visit('')

    cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente em breve.')
  })

  it('Should logout on AccessDeniedError', () => {
    Http.mockAccessDeniedError()

    cy.visit('')

    Helper.testUrl('/login')
  })

  it('Should present correct username', () => {
    Http.mockUnexpectedError()

    cy.visit('')

    const { name } = Helper.getLocalStorageItem('account')
    cy.getByTestId('username').should('contain.text', name)
  })

  it('Should logout on logout click link', () => {
    Http.mockUnexpectedError()

    cy.visit('')

    cy.getByTestId('logout').click()
    Helper.testUrl('/login')
  })
})
