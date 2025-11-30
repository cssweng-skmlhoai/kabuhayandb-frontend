Cypress.Commands.add("mockAdminLogin", () => {
  cy.visit("/members"); // Admin dashboard route

  cy.window().then((win) => {
    win.useAuthStore.setState({
      isAuth: true,
      isAdmin: true,
      memberId: 1,
    });
  });
});
