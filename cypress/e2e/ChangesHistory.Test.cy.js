describe("Changes History Page - Frontend Tests", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.mockAdminLogin();

    cy.visit("/changesHistory");

    cy.fixture("change_history.json").then((data) => {
    cy.intercept("GET", "**/changes*", (req) => {
      let filtered = data.changes;

      // Filter by search
      if (req.query.search) {
        const search = req.query.search.toLowerCase();
        filtered = filtered.filter((item) =>
          item.member.toLowerCase().includes(search)
        );
      }

      // Filter by selected admin
      if (req.query.admin && req.query.admin !== "All") {
        filtered = filtered.filter(
          (item) => item.changedBy === req.query.admin
        );
      }

      // Filter by date range
      if (req.query.dateFrom) {
        const from = new Date(req.query.dateFrom);
        from.setHours(0, 0, 0, 0);
        filtered = filtered.filter((item) => new Date(item.date) >= from);
      }

      if (req.query.dateTo) {
        const to = new Date(req.query.dateTo);
        to.setHours(23, 59, 59, 999);
        filtered = filtered.filter((item) => new Date(item.date) <= to);
      }

      console.log("FROM:", req.query.dateFrom, "TO:", req.query.dateTo);

      req.reply({
        changes: filtered,
        total: filtered.length,
        totalPages: 1,
      });
    }).as("getChanges");
  });
  });

  /**
   * Test #1: Verify that the Change History page loads with all required UI elements.
   * Ensures that headers, search input, dropdowns, reset filters button,
   * and the table column headers are rendered correctly on initial page load.
   */
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

  /**
   * Test #2: Validate that the table correctly loads and displays mocked change history data.
   * Confirms that each mocked record (Update, Add, Delete) appears with accurate details,
   * including date, admin, member, change type, and past/new values.
   */
  it("Test 2: Table loads with mocked data", () => {
    cy.wait("@getChanges");

    // --- UPDATE ENTRY ---
    cy.contains("John Doe")
      .parents("tr")
      .within(() => {
        cy.contains("Update");
        cy.contains("12/1/2025");
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
        cy.contains("12/2/2025");
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

  /**
   * Test #3: Ensure that the Reset Filters button restores the search field to empty.
   * After typing text in the search field, clicking Reset Filters
   * should instantly clear the input and trigger the correct state update.
   */
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

  /**
   * Test #4: Filter change logs by selected admin.
   * This test simulates selecting an admin from the "Changed By" dropdown.
   * The frontend is assumed to append the selected admin to the API request as `admin`.
   */
  it("Test 4: Filter change logs by admin", () => {
    cy.wait("@getChanges");
    
    // Open the dropdown
    cy.contains("button", "Changed By").click();

    // Wait until the dropdown content is visible
    cy.get('[role="menu"]').should('be.visible');

    // Click the admin
    cy.contains('[role="menuitem"]', "Admin 2").click();

    cy.wait("@getChanges");

    // Verify table updates
    cy.get("table tbody").contains("Admin 2").should("be.visible");
    cy.get("table tbody").contains("Admin 1").should("not.exist");

    cy.contains("button", "Changed By").click();

    cy.get('[role="menu"]').should('be.visible');
    
    cy.contains('[role="menuitem"]', "Admin 1").click();

    cy.get("table tbody").contains("Admin 1").should("be.visible");
    cy.get("table tbody").contains("Admin 2").should("not.exist");
    cy.get("table tbody").contains("Admin 3").should("not.exist");
  });

  /**
   * Test #5: Verify search functionality filters results based on member name.
   * Typing "John" should filter out any rows that do not contain "John Doe".
   */
  it("Test 5: Search change logs by member name", () => {
    cy.wait("@getChanges");

    // Type in search input
    cy.get('input[placeholder="Search Affected Member Name"]').type("John");
    
    // Optionally wait for filtered API call if frontend triggers a request
    cy.wait("@getChanges");

    // Table should only show John Doe
    cy.get("table tbody").contains("John Doe").should("exist");
    cy.get("table tbody").contains("Jane Smith").should("not.exist");
  });

  /**
   * Test #6: Validate filtering by date range using the date picker component.
   * After selecting a specific start and end date, only records whose dates fall within
   * the range should remain visible.
   */
  it("Test 6: Filter change logs by date range", () => {
    cy.wait("@getChanges");

    // Open the date picker popover
    cy.contains("Date Range").click();

    cy.get('div[role="dialog"] button').contains(/^1$/).click();
    cy.get('div[role="dialog"] button').contains(/^3$/).click();

    // Wait for API to be called with the selected date range
    cy.wait("@getChanges");

    cy.contains("John Doe").should("exist");
    cy.contains("Jane Smith").should("exist");
    cy.contains("Carlos Reyes").should("not.exist");
  });
});
