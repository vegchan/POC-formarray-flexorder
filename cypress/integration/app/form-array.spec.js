/// <reference types="Cypress" />

const addRateAndQuantity = (rate, quantity, index) => {
  cy.get(".form-inline")
    .get("[id^=rate_]")
    .eq(index)
    .type(rate);
  cy.get(".form-inline")
    .get("[id^=quantity_]")
    .eq(index)
    .type(quantity);
};

const addRowAt = index => {
  cy.get(".form-inline")
    .get("button.btn-primary")
    .eq(index)
    .click();
};
context("Assertions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200/");
  });

  describe("Check if landing loads", () => {
    it("should load landing page", () => {
      cy.get("h1").should("contain", "Test Sortable Form Array");
      cy.get(".form-inline").should("have.length", 1);
    });
  });

  describe("Check if total calculation works", () => {
    it("should calculate total based on rate & quantity", () => {
      cy.get(".form-inline")
        .first()
        .get("[id^=rate_]")
        .type("10");
      cy.get(".form-inline")
        .first()
        .get("[id^=quantity_]")
        .type("2");
      cy.get(".form-inline")
        .first()
        .get("[id^=total_]")
        .should("have.value", "20");
    });
  });

  describe("Check if new row can be added", () => {
    it("should add new row when click on add button", () => {
      cy.get(".form-inline")
        .first()
        .get("button.btn-primary")
        .click();
      cy.get(".form-inline").should("have.length", 2);
    });
  });

  describe("Check if row can be deleted", () => {
    it("should delete corresponding row when clicked on delete button", () => {
      cy.get(".form-inline")
        .first()
        .get("button.btn-primary")
        .click();
      cy.get(".form-inline").should("have.length", 2);
      cy.get(".form-inline")
        .get("button.btn-danger")
        .eq(1)
        .click();
      cy.get(".form-inline").should("have.length", 1);
    });
  });

  describe("Check if rows are ordered", () => {
    it("should order row based on rate & quantity", () => {
      const expectedOrder = ['1', '2', '0'];
      addRateAndQuantity(10, 2, 0);
      addRowAt(0);
      addRateAndQuantity(20, 2, 1);
      addRowAt(1);
      addRateAndQuantity(5, 2, 2);
      cy.wait(3000)
        .get(".form-row")
        .each(($el, index) => {
            console.log(index);
          cy.wrap($el)
            .should("have.css", "order")
            .and('eq', expectedOrder[index]);
        });
    });
  });
});
