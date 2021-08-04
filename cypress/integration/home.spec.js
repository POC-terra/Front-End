const username = Cypress.env("kc_login");

describe("Home Page", () => {
  beforeEach(() => {
    cy.kcLogin(username);
  });

  afterEach(() => {
    cy.kcLogout();
  });

  it("should display home page", () => {
    cy.contains(`Bienvenue ${username} !`);
  });

  it("should change language to english", () => {
    cy.get("#language-button")
      .contains("Langues")
      .click();
    cy.get("#language-menu > div > ul > li")
      .should("have.length", 2)
      .then(languages => {
        Array.from(languages)
          .find(language => language.textContent === "en")
          .click();
      });

    cy.contains(`Welcome ${username} !`);
  });
});
