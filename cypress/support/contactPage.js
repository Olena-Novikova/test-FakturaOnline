class ContactPage {
    clickNewContactButton(domain) {
      const buttonText = {
        cz: 'Nový kontakt',
        sk: 'Nový kontakt',
        com: 'New contact',
      };
  
      cy.contains('button', buttonText[domain]).should('be.visible').click();
    }

    fillContactForm(contactData, domain) {
        const fieldSelectors = {
          cz: {
            "Name": '[name="invoice_attributes_name"]',
            "E-mail": '[name="email"]',
            // Добавь остальные поля по мере необходимости
          },
          sk: {
            "Name": '[name="invoice_attributes_name"]',
            "E-mail": '[name="email"]',
            // Добавь остальные поля по мере необходимости
          },
          com: {
            "Name": '#invoice_attributes_name',
            "E-mail": '[name="email"]',
            // Добавь остальные поля по мере необходимости
          }
        };
      
        const selectors = fieldSelectors[domain];
      
        Object.entries(selectors).forEach(([label, selector]) => {
          if (contactData[label]) {
            cy.get(selector).clear().type(contactData[label]);
          }
        });
      }
      
  
    saveContact(domain) {
      const saveButtonText = {
        cz: 'Uložit',
        sk: 'Uložiť',
        com: 'Save',
      };
  
      cy.contains('button', saveButtonText[domain]).click();
    }
  }
  
  export default ContactPage;
  