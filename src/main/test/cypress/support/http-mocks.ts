import { faker } from '@faker-js/faker'
import { type Method } from 'cypress/types/net-stubbing'

export const mockInvalidCredentialsError = (url: RegExp): void => {
  cy.intercept(
    'POST',
    url,
    { statusCode: 401, body: { error: faker.word.words() } }
  ).as('request')
}

export const mockEmailInUseError = (url: RegExp): void => {
  cy.intercept(
    'POST',
    url,
    { statusCode: 403, body: { error: faker.word.words() } }
  ).as('request')
}

export const mockUnexpectedError = (url: RegExp, method: Method): void => {
  cy.intercept(
    method,
    url,
    {
      statusCode: faker.helpers.arrayElement([400, 404, 500]),
      body: { error: faker.word.words() }
    }
  ).as('request')
}

export const mockOk = (url: RegExp, method: Method, response: any): void => {
  cy.intercept(
    method,
    url,
    { statusCode: 200, body: response }
  ).as('request')
}
