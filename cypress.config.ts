import { defineConfig } from 'cypress'

import cypressEslint from '@cypress/webpack-preprocessor'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    fixturesFolder: 'src/main/test/cypress/fixtures',
    supportFile: 'src/main/test/cypress/support/e2e.{ts,tsx}',
    specPattern: 'src/main/test/cypress/e2e/**/*.cy.{ts,tsx}',
    setupNodeEvents (on, config) {
      on('file:preprocessor', cypressEslint({
        webpackOptions: {
          resolve: { extensions: ['.ts', '.js'] },
          module: {
            rules: [
              {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
              }
            ]
          }
        }
      }))
    }
  }
})
