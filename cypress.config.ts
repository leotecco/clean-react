import { defineConfig } from 'cypress'

import cypressEslint from '@cypress/webpack-preprocessor'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    fixturesFolder: false,
    supportFile: false,
    specPattern: 'src/main/test/cypress/**/*.cy.{js,jsx,ts,tsx}',
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
