describe("Changes History Page - Frontend Tests", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.mockAdminLogin();

    cy.visit("/changesHistory");

    cy.intercept("GET", "**/changes*", {
      fixture: "change_history.json",
    }).as("getChanges");
  });

  it("Test 1: Page loads with headers, inputs, buttons, and table", () => {
    cy.contains("Change History").should("be.visible");
    cy.contains("View changes in member details by admin").should("be.visible");
    cy.get('input[placeholder="Search Affected Member Name"]').should(
      "be.visible"
    );

    cy.contains("Changed By").should("be.visible");
    cy.contains("Date Range").should("be.visible");
    cy.contains("Reset Filters").should("be.visible");

    cy.get("table thead").contains("Date Changed").should("exist");
    cy.get("table thead").contains("Admin").should("exist");
    cy.get("table thead").contains("Member").should("exist");
    cy.get("table thead").contains("Change Type").should("exist");
    cy.get("table thead").contains("Field Changed").should("exist");
    cy.get("table thead").contains("Past Value").should("exist");
    cy.get("table thead").contains("New Value").should("exist");
  });

  it("Test 2: Table loads with mocked data", () => {
    cy.wait("@getChanges");

    // --- UPDATE ENTRY ---
    cy.contains("John Doe")
      .parents("tr")
      .within(() => {
        cy.contains("Update");
        cy.contains("1/1/2025");
        cy.contains("Admin 1");
        cy.contains("first_name");
        cy.contains("John");
        cy.contains("Johnny");
      });

    // --- ADD ENTRY ---
    cy.contains("Jane Smith")
      .parents("tr")
      .within(() => {
        cy.contains("Add");
        cy.contains("1/2/2025");
        cy.contains("Admin 2");
        cy.contains("family_member");
        cy.contains("Added: Sister - Mary Smith");
      });

    // --- DELETE ENTRY ---
    cy.contains("Carlos Reyes")
      .parents("tr")
      .within(() => {
        cy.contains("Delete");
        cy.contains("1/3/2025");
        cy.contains("Admin 3");
        cy.contains("middle_name");
        cy.contains("Anton");
        cy.contains("Antonio");
      });
  });

  it("Test 3: Reset Search filter", () => {
    cy.wait("@getChanges");

    // Type something in search input
    cy.get('input[placeholder="Search Affected Member Name"]').type("Test");
    cy.contains("Reset Filters").click();

    // Input should be cleared
    cy.get('input[placeholder="Search Affected Member Name"]').should(
      "have.value",
      ""
    );
  });

  /*it("Test 4: Filter change logs by admin", () => {
    cy.wait("@getChanges");
    
    // Mock the filtered response for Admin 1
    cy.intercept("GET", //TBA, {
        fixture: "change_history.json"
    }).as("getChangesByAdmin");

    cy.contains("Changed By").click();
    cy.contains("Admin 1").click();

    cy.wait("@getChangesByAdmin");

    cy.get("table tbody").contains("Admin 1").should("be.visible");
    cy.get("table tbody").contains("Admin 2").should("not.exist");
    cy.get("table tbody").contains("Admin 3").should("not.exist");
  });*/

  /*it("Test 5: Search change logs by member name", () => {
    cy.wait("@getChanges");
    cy.intercept("GET", //TBA, {
        fixture: "change_history.json" // only includes John Doe
    }).as("getChangesSearch");

    cy.get('input[placeholder="Search Affected Member Name"]').type("John");
    cy.wait("@getChangesSearch");

    cy.get("table tbody tr").should("have.length", 1);
    cy.get("table tbody").contains("John Doe").should("be.visible");
  });*/

  /*it("Test 6: Filter change logs by date range (check date field only)", () => {
    cy.wait("@getChanges");

    // Select a date range
    cy.contains("Date Range").click();
    cy.get(".rdp-day").contains("1").click(); // Jan 1
    cy.get(".rdp-day").contains("2").click(); // Jan 2

    // Check that the table contains only the expected dates
    cy.get("table tbody").contains("1/1/2025").should("be.visible");
    cy.get("table tbody").contains("1/2/2025").should("be.visible");

    // Dates outside the range should not be present
    cy.get("table tbody").contains("1/3/2025").should("not.exist");
    });
    */
});
