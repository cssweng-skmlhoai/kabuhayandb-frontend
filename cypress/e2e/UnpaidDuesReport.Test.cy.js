describe("Unpaid Dues Report - Tests", () => {
  /**
   * This beforeEach executes prior to each test in this file. It ensures that the app is in an admin account.
   * Since these tests focus on the frontend functionality of the Unpaid Dues Report page, we mock the backend response
   * to provide consistent data for testing.
   */
  beforeEach(() => {
    cy.viewport(1280, 800); // Set viewport size to desktop dimensions
    cy.mockAdminLogin(); // Mock admin login and visit admin dashboard

    // Intercept the GET request to the unpaid dues report endpoint and respond with fixture data
    cy.intercept("GET", "**/dues/unpaidDuesReport", {
      fixture: "UnpaidDues.json", // Mocked data file
    }).as("getUnpaidDues");
  });

  /**
   * Test #1: Verify navigation to the unpaid dues report page and visibility of key elements.
   * This test checks that the user can navigate to the unpaid dues report page and that all necessary UI components are present.
   */
  it("Test #1: Navigate to unpaid dues report page", () => {
    cy.visit("/searchMemberDues"); // Navigate to the member dues search page
    cy.contains("Select Due Report").click(); // Open the report selection dropdown
    cy.contains("Unpaid Due Report").click(); // Select the unpaid dues report

    cy.url().should("include", "/unpaidDuesReport"); // Verify URL
    cy.get("select").should("be.visible");
    cy.get('input[type="text"]').should("be.visible");
    cy.contains("Generate Report").should("be.visible");
    cy.get("table").should("be.visible");
  });

  /**
   * Test #2: Verify mobile responsiveness of the unpaid dues report page.
   * This test ensures that the unpaid dues report page displays correctly on mobile devices.
   */
  it("Test #2: Responsive Unpaid Dues Report Page", () => {
    cy.viewport("iphone-6"); // Set viewport to iPhone 6 dimensions
    cy.visit("/unpaidDuesReport");
    cy.wait("@getUnpaidDues"); // Wait for the mocked data to load

    cy.get("select").select("blockNo");
    cy.get('input[type="text"]').type("13");
    cy.contains("Generate Report").click();

    cy.contains("Mark Reyes").should("be.visible");
    cy.get("table").should("be.visible");
  });

  /**
   * Test #3: Verify report generation with valid input.
   * This test checks that the report is generated correctly when valid input is provided.
   */
  it("Test #3: Generate report with valid input", () => {
    cy.visit("/unpaidDuesReport");
    cy.wait("@getUnpaidDues");

    cy.get("select").select("blockNo");
    cy.get('input[type="text"]').type("3");
    cy.contains("Generate Report").click();

    cy.contains("Juan Dela Cruz").should("be.visible");
    cy.contains("Abby Salle").should("be.visible");
    cy.contains("Emma Fuente").should("not.exist");
  });

  /**
   * Test #4: Verify behavior when generating report with empty input.
   * This test checks that the application handles empty input gracefully and displays the full list of unpaid dues.
   */
  it("Test #4: Generate report with search field empty", () => {
    cy.visit("/unpaidDuesReport");
    cy.wait("@getUnpaidDues");

    cy.get("select").select("household"); // or leave empty for member+address search
    cy.get('input[type="text"]').clear(); // ensure empty
    cy.contains("Generate Report").click();

    cy.get("table").should("exist"); // full list shown (no error)
  });

  /**
   * Test #5: Verify behavior when no matching records are found.
   * This test ensures that the application displays an appropriate message when the search yields no results.
   */
  it("Test #5: Generate report with an out of range input", () => {
    cy.visit("/unpaidDuesReport");
    cy.wait("@getUnpaidDues");

    cy.get("select").select("lotNo");
    cy.get('input[type="text"]').type("-1");
    cy.contains("Generate Report").click();

    cy.contains("No matching records found.").should("be.visible");
  });

  /**
   * Test #6: Verify switching between different search criteria.
   * This test checks that the user can switch between different search criteria and that the report updates accordingly.
   */
  it("Test #6: Resetting filters after generating a report", () => {
    cy.visit("/unpaidDuesReport");
    cy.wait("@getUnpaidDues");

    // First: Block 3
    cy.get("select").select("blockNo");
    cy.get('input[type="text"]').type("3");
    cy.contains("Generate Report").click();
    cy.contains("Juan Dela Cruz").should("be.visible");

    // Then: Lot 8
    cy.get("select").select("lotNo");
    cy.get('input[type="text"]').clear().type("8");
    cy.contains("Generate Report").click();
    cy.contains("Emma Fuente").should("be.visible");
    cy.contains("Juan Dela Cruz").should("not.exist");
  });
});
