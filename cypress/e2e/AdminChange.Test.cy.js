describe("Change History Page - Frontend Tests", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.mockAdminLogin();

    cy.intercept("GET", "**/members/home", {
      fixture: "members.json",
    }).as("getMembers");
  });

  /* TEST 1: Login and navigate to dashboard page */
  it("Test 1: Loads members page for admin", function () {
    cy.visit("/members");
    cy.wait("@getMembers");

    // Check that the mocked members are rendered
    cy.get(".bg-customgray2")
      .eq(0)
      .contains("Sabrina Carpenter")
      .should("be.visible");
    cy.get(".bg-customgray2").eq(0).contains("President").should("be.visible");

    cy.get(".bg-customgray2").eq(1).contains("John Doe").should("be.visible");
    cy.get(".bg-customgray2").eq(1).contains("Member").should("be.visible");

    cy.get(".bg-customgray2").contains("Treasurer").should("not.exist");
  });

  /* TEST 2: Edit a member's details */
  it("Test 2: Clicks ellipsis menu, selects edit, and verifies input fields are prefilled then save changes", function () {
    const memberId = 1;

    // Mock API call for getting a single member's info
    cy.intercept("GET", `/members/info/${memberId}`, {
      fixture: "member_1.json",
    }).as("getMember");

    // Open the ellipsis menu and click "Edit Details"
    cy.get(".bg-customgray2").first().find("button.cursor-pointer").click();
    cy.contains("Edit Details").click();

    // Wait for the single member API response
    cy.wait("@getMember");

    // Verify that the member's input fields are prefilled correctly
    cy.get('input[placeholder="Last Name"]').should("have.value", "Carpenter");
    cy.get('input[placeholder="First Name"]').should("have.value", "Sabrina");
    cy.get('input[placeholder="Middle Name"]').should("have.value", "A");
    cy.get('input[type="date"]').should("have.value", "1990-01-01");
    cy.get("select").should("have.value", "Female");
    cy.get('input[placeholder="Contact Number"]').should(
      "have.value",
      "09123456789"
    );

    // Verify related member info in the popover
    cy.get(".hover\\:no-underline").first().click();
    cy.get('div[data-state="open"]')
      .first()
      .within(() => {
        cy.get('input[placeholder="Last Name"]').should("have.value", "Doe");
        cy.get('input[placeholder="First Name"]').should("have.value", "Jane");
        cy.get('input[placeholder="Middle Name"]').should("have.value", "B");
        cy.get('input[placeholder="Relation to Member"]').should(
          "have.value",
          "Sister"
        );
      });

    // Mock API call for updating member info
    cy.intercept("PUT", "/members/info/*", {
      statusCode: 200,
      body: { success: true },
    }).as("updateMember");

    // Click "Save Changes" and confirm in the dialog
    cy.contains("Save Changes").click();
    cy.get('div[role="dialog"]')
      .should("be.visible")
      .within(() => {
        cy.contains("button", "Proceed").click();
      });

    // Wait for the update member API call to complete
    cy.wait("@updateMember");
  });
});
