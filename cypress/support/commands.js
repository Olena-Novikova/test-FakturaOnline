Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes("Cannot read properties of null (reading 'locale')")) {
    return false; // не падаем на этой ошибке
  }
});

 
 
 Cypress.Commands.add('visitOnDomain', (args, domain = Cypress.env('currentDomain')) => {
    const customVisitCommand = `visit${domain.charAt(0).toUpperCase()}${domain.slice(1)}`;
    cy[customVisitCommand](args);
  });

  // Home page
  Cypress.Commands.add('visitCz', (args) => {
    cy.visit(`https://dev.fakturaonline.cz${args}`);
  });

  Cypress.Commands.add('visitCom', (args) => {
    cy.visit(`https://dev.invoiceonline.com${args}`);
  });

  Cypress.Commands.add('visitSk', (args) => {
    cy.visit(`https://dev.fakturaonline.sk${args}`);
  });

  // Login page
  Cypress.Commands.add('visitLoginPage', (domain) => {
    const paths = {
      cz: '/prihlaseni',
      com: '/login',
      sk: '/prihlasenie'
    };
    cy.visitOnDomain(paths[domain], domain);
  });

  // Contact page
  Cypress.Commands.add('visitContactPage', (domain) => {
    const paths = {
      cz: '/kontakty',
      com: '/contacts',
      sk: '/kontakty'
    };
    cy.visitOnDomain(paths[domain], domain);
  });

  // Authorization and transition to Contact page

  import LoginPage from './loginPage';
  import { loginPagePaths } from './loginPage';

Cypress.Commands.add('loginAndGoToContacts', (domain) => {
  const loginPage = new LoginPage();
  const paths = loginPagePaths[domain];

   cy.fixture('example').then((users) => {
    const user = users[domain];

   cy.clearCookies();

   // Переход на страницу логина
   cy.visitLoginPage(domain);

   // Убедимся, что попали на логин
   cy.url().should('include', paths.loginPage);

   // Логинимся
   loginPage.login(user.email, user.password, domain);

   //Ждём, пока произойдёт редирект после логина
   cy.url().should('not.include', paths.loginPage);

   // Переход на страницу контактов
   cy.visitOnDomain(paths.contactPage, domain);

   // Убеждаемся, что мы на нужной странице
   cy.url().should('include', paths.contactPage);
    });
  });

