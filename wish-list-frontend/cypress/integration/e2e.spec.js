import config from '../config';

describe('e2e testing', () => {
  it('arrive at login', () => {
    cy.visit(config.testTarget)
    cy.contains('username')
  })

  it('log in', () => {
    cy.visit(config.testTarget)
    cy.get('input[name=username]').type('autotester')
    cy.get('input[name=password]').type('at1{enter}')
    cy.url().should('include', '/wisher')
  })
})