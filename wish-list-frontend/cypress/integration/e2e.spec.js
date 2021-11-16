import config from '../config';


describe('e2e testing', () => {
  it('arrive at login', () => {
    cy.visit(config.testTarget)
    cy.contains('username')
  })

  it('log in', () => {
    cy.visit(config.testTarget)
    cy.get('[data-cy=login-username]').type('autotester')
    cy.get('[data-cy=login-password]').type('at1{enter}')
    cy.url().should('include', '/wisher')
  })
})