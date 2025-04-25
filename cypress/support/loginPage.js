class LoginPage {
    login(email, password, domain) {

      cy.wait(500);
  
      cy.get('body').then(($body) => {
        if ($body.find('input[name="email"]').length > 0) {
          // Форма сразу доступна
          this.fillForm(email, password, domain);
        } else {
          // Сначала кликаем по кнопке входа
          const firstStepButtonText = {
            cz: 'Přihlásit se do mého účtu',
            sk: 'Prihlásenie do môjho konta',
            com:'Log in to my account'
          };
  
          cy.contains('button', firstStepButtonText[domain], { timeout: 10000 }).click();
  
          // Ждём появления формы
          cy.get('input[name="email"]').should('be.visible');
  
          // Заполняем форму
          this.fillForm(email, password, domain);
        }
      });
    }
  
    fillForm(email, password, domain) {
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
  
      const secondStepButtonText = {
        cz: 'Přihlásit se',
        sk: 'Prihlásiť sa', 
        com: 'Log in',
      };
  
      cy.get('.el-form > .el-button > :nth-child(1) > span').contains(secondStepButtonText[domain], { timeout: 10000 }).should('be.visible').click();
    }
  }
  
  export default LoginPage;
  
    export const loginPagePaths = {
      cz: {
        contactPage: '/kontakty',
        loginPage: '/prihlaseni'
      },
      com: {
        contactPage: '/contacts',
        loginPage: '/login'
      },
      sk: {
        contactPage: '/kontakty',
        loginPage: '/prihlasenie'
      }
    };
  
  
  