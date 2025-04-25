import { loginPagePaths} from '../support/loginPage'; 
import LoginPage from '../support/loginPage';
import ContactPage from '../support/contactPage';

describe('An unregistered user cannot access the "Contacts" page', () => {
  Object.keys(loginPagePaths).forEach(domain => {
    const paths = loginPagePaths[domain];

    it(`${domain}: should block access to contacts page for unauthenticated user`, () => {
      cy.clearCookies();

      // 1. Go to the contacts page
      cy.visitOnDomain(paths.contactPage, domain);

      // 2. Check that user got to the login page
      cy.url().should('include', paths.loginPage);

      // 3. Check that the user is NOT on the contact page
      cy.url().should('include', paths.loginPage); // should redirect to login
      cy.url().should('not.include', paths.contactPage); // should NOT remain on /contacts
     });
   });
});

describe('The "Contacts" page is available only to a registered user', () => {
  Object.keys(loginPagePaths).forEach(domain => {
    const paths = loginPagePaths[domain];

    it(`${domain}: should redirect and allow login`, () => {
       cy.fixture('example').then((users) => {
       const user = users[domain];
      
       cy.clearCookies();

       // 1. Go to the contacts page
       cy.visitOnDomain(paths.contactPage, domain);

       // 2. Let's make sure that the redirect worked and we got to the login
       cy.url().should('include', paths.loginPage);

       // 3. Login
       const loginPage = new LoginPage();
       loginPage.login(user.email, user.password, domain);

       // 4. Wait until the redirect occurs after login
       cy.url().should('not.include', paths.loginPage);

       // 5. Go back to the contacts page
       cy.visitOnDomain(paths.contactPage, domain);

       // 6. Let's check that after logging in we are on the contacts page
       cy.url().should('include', paths.contactPage);
      });
    });
  });
});


describe('Registered user can manage contacts', () => {
  Object.keys(loginPagePaths).forEach(domain => {
  const contactPage = new ContactPage();

    it(`${domain}: should  create, edit and delete contacts`, () => {
      cy.loginAndGoToContacts(domain);

      cy.fixture('example').then((data) => {
        const contactData = data[domain].contact;

        // Create a new contact
        contactPage.clickNewContactButton(domain);
        contactPage.fillContactForm(contactData, domain);
        contactPage.saveContact(domain);

        // Make sure contact is created - check name
        cy.contains(contactData['Name']).should('be.visible');

        // Edit contact
        cy.reload();
        cy.wait(500);

        // Click  the Edit icon
        cy.get('[data-analytics-id="icon-pen"]', { timeout: 5000 })
        .first()
        .scrollIntoView()
        .click({ force: true })
          
        // Phone field
        const phoneSelector = 'input[type="tel"].vti__input.el-input__inner';

        // Enter phone number
        cy.get(phoneSelector, { timeout: 5000 })
        .type(contactData['Telefon'] || contactData['Telefón'] || contactData['Phone']);

        // Click Save
        cy.contains('button', /Uložit změny|Uložiť|Save/).click();

       // Check if the update has passed
        cy.contains(contactData['Name']).should('be.visible');

        // Delete contact

        cy.reload();
        cy.wait(500);

        // Click the Delete icon
        cy.get('[data-analytics-id="icon-trash-alt"]', { timeout: 5000 })
        .first()
        .scrollIntoView()
        .click({ force: true })
        
       // Confirm deletion
        cy.get('[data-analytics-id="confirmButtonTitle"]').contains('button', /Ano smazat|Áno zmazať|Yes, delete/).click();
 
       // Check if contact is deleted
        cy.contains(contactData['Name']).should('not.exist');
       });
     });
   });
 });
