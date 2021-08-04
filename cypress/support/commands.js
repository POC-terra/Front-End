// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("kcLogin", (username = Cypress.env("kc_login"), password = Cypress.env("kc_password")) => {
  cy.visit(Cypress.env("api_server"));

  cy.get("#kc-form-login").within($form => {
    cy.get('input[name="username"]')
      .type(username)
      .should("have.value", username);

    cy.get('input[name="password"]')
      .type(password)
      .should("have.value", password);
    cy.root().submit();
  });
});

Cypress.Commands.add("kcLogout", () => {
  cy.get("#logout").click();
});
