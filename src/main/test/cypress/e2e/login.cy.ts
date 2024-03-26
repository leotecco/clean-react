import { faker } from '@faker-js/faker'

const baseUrl: string = Cypress.config().baseUrl

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readOnly')

    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('contain.text', '🔴')

    cy.getByTestId('password').should('have.attr', 'readOnly')

    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('contain.text', '🔴')

    cy.getByTestId('submit')
      .should('have.attr', 'disabled')

    cy.getByTestId('error-wrap')
      .should('not.have.descendants')
  })

  it('Should present error if form is invalid', () => {
    cy.getByTestId('email').focus()
    cy.getByTestId('email').type(faker.word.words())
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴')

    cy.getByTestId('password').focus()
    cy.getByTestId('password').type(faker.string.alphanumeric(3))
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴')

    cy.getByTestId('submit')
      .should('have.attr', 'disabled')

    cy.getByTestId('error-wrap')
      .should('not.have.descendants')
  })

  it('Should present valid if form is valid', () => {
    cy.getByTestId('email').focus()
    cy.getByTestId('email').type(faker.internet.email())
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Tudo certo!')
      .should('contain.text', '🟢')

    cy.getByTestId('password').focus()
    cy.getByTestId('password').type(faker.string.alphanumeric(5))
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Tudo certo!')
      .should('contain.text', '🟢')

    cy.getByTestId('submit')
      .should('not.have.attr', 'disabled')

    cy.getByTestId('error-wrap')
      .should('not.have.descendants')
  })

  it('Should present UnexpectedError on 400', () => {
    cy.intercept(
      'POST',
      'http://localhost:5050/api/login',
      {
        statusCode: 400,
        body: {
          error: faker.word.words()
        }
      })

    cy.getByTestId('email').focus()
    cy.getByTestId('email').type(faker.internet.email())

    cy.getByTestId('password').focus()
    cy.getByTestId('password').type(faker.string.alphanumeric(5))

    cy.getByTestId('submit').click()

    cy.getByTestId('main-error').should('exist')
    cy.getByTestId('main-error').should('contain.text', 'Algo de errado aconteceu. Tente novamente em breve.')

    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should present InvalidCredentialsError on 401', () => {
    cy.intercept(
      'POST',
      'http://localhost:5050/api/login',
      {
        statusCode: 401,
        body: {
          error: faker.word.words()
        }
      })

    cy.getByTestId('email').focus()
    cy.getByTestId('email').type(faker.internet.email())

    cy.getByTestId('password').focus()
    cy.getByTestId('password').type(faker.string.alphanumeric(5))

    cy.getByTestId('submit').click()

    cy.getByTestId('main-error').should('exist')
    cy.getByTestId('main-error').should('contain.text', 'Credenciais inválidas')

    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should present UnexpectedError if invalid data is returned', () => {
    cy.intercept(
      'POST',
      'http://localhost:5050/api/login',
      {
        statusCode: 200,
        body: {
          invalidProperty: faker.string.uuid()
        }
      })

    cy.getByTestId('email').focus()
    cy.getByTestId('email').type(faker.internet.email())

    cy.getByTestId('password').focus()
    cy.getByTestId('password').type(faker.string.alphanumeric(5))

    cy.getByTestId('submit').click()

    cy.getByTestId('main-error').should('exist')
    cy.getByTestId('main-error').should('contain.text', 'Algo de errado aconteceu. Tente novamente em breve.')

    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should present save accessToken valid credentials are provided', () => {
    cy.intercept(
      'POST',
      'http://localhost:5050/api/login',
      {
        statusCode: 200,
        body: {
          accessToken: faker.string.uuid()
        }
      })

    cy.getByTestId('email').focus()
    cy.getByTestId('email').type('teste@teste.com')

    cy.getByTestId('password').focus()
    cy.getByTestId('password').type('123456')

    cy.getByTestId('submit').click()

    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('not.exist')

    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then(window => { assert.isOk(window.localStorage.getItem('accessToken')) })
  })
})
