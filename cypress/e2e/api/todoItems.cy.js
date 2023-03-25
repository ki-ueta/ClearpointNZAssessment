const getToDoItems = `${Cypress.env("apiUrl")}/todoItems`;

describe("GET /todoItems/:itemId", () => {
  context("return 200 OK response", () => {
    it("Incompleted todo", () => {
      // Define todoJson
      cy.fixture("todo")
        .then((todoJson) => {
          todoJson.description = `test time >>> ${Date.now()}`;
          todoJson.isCompleted = false;
        })
        .as("todoJson")
        .then(function () {
          // Create a todo and use todoJson as a request body
          cy.request("POST", `${getToDoItems}`, {
            description: `${this.todoJson.description}`,
          })
            .its("body")
            .as("itemId")
            .then(function () {
              // Get the created todo using id
              this.todoJson.id = this.itemId;
              cy.request("GET", `${getToDoItems}/${this.itemId}`);
            })
            .then((response) => {
              // Validate /todoItems/:itemId response
              expect(response).property("status").to.equal(200);
              expect(response).property("body").to.contain(this.todoJson);
            });
        });
    });

    it("Completed todo", () => {
      // Define todoJson
      cy.fixture("todo")
        .then((todoJson) => {
          todoJson.description = `test time >>> ${Date.now()}`;
          todoJson.isCompleted = true;
        })
        .as("todoJson")
        .then(function () {
          // Create a todo and use todoJson as a request body
          cy.request("POST", `${getToDoItems}`, {
            description: `${this.todoJson.description}`,
          })
            .its("body")
            .as("itemId")
            .then(function () {
              // Complete the created todo using id
              this.todoJson.id = this.itemId;
              cy.request("PUT", `${getToDoItems}/${this.itemId}`, this.todoJson)
              .should('have.property', 'status', 204)
            })
            .then(function () {
              // Get the created todo using id
              cy.request("GET", `${getToDoItems}/${this.itemId}`).then((response) => {
                expect(response).property("status").to.equal(200);
                expect(response).property("body").to.contain(this.todoJson);
              });
            });
        });
    });
  });

  context("return 404 NotFound response", () => { 
    it("Invalid format id", () => {
      let invalidFormatId = `999`;
      // Get the created todo using id
      cy.request({
        method: "GET",
        url: `${getToDoItems}/${invalidFormatId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response).property("status").to.equal(404);
        expect(response).property("body").to.be.empty;
      });
    });

    it("Not exist id", () => {
      let notExistId = crypto.randomUUID();
      // Get the created todo using id
      cy.request({
        method: "GET",
        url: `${getToDoItems}/${notExistId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response).property("status").to.equal(404);
        expect(response).property("body").to.contain(`Todo item with id ${notExistId} not found`);
      });
    });
  });
});
