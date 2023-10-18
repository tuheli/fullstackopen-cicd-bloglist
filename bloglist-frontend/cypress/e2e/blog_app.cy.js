describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown.', function() {
    cy.contains('Login to Application')
  })

  describe('Login', function() {
    beforeEach(function() {
      localStorage.clear()

      const user = {
        username: 'tuheli',
        name: 'Elias Tuhola',
        password: 'salasana'
      }

      cy.request('POST', 'http://localhost:3003/api/users', user)
    })

    it('Succeeds with correct credentials.', function() {
      const existingUser = {
        username: 'tuheli',
        name: 'Elias Tuhola',
        password: 'salasana'
      }

      cy.login(existingUser)
      cy.contains('Logout')
      cy.contains('Create Blog')
      cy.contains('Broken test???!??€#€"#')
    })

    it('Fails with wrong credentials.', function() {
      cy.get('[data-testid="input-username"]').type('tuheli')
      cy.get('[data-testid="input-password"]').type('vaarin')
      cy.get('[data-testid="login-button"]').click()
      cy.contains('Wrong username or password.')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      localStorage.clear()

      const user = {
        username: 'tuheli',
        name: 'Elias Tuhola',
        password: 'salasana'
      }

      cy.request('POST', 'http://localhost:3003/api/users', user)
        .then(() => {
          cy.login(user)
        })
    })

    it('A blog can be created.', function() {
      cy.contains('Create Blog').click()
      cy.get('[data-testid="title-input"]').type('Test Title')
      cy.get('[data-testid="author-input"]').type('Test Author')
      cy.get('[data-testid="url-input"]').type('Test Url')
      cy.get('[data-testid="create-blog-button"]').click()
      cy.get('[data-testid="bloglist"]').contains('Test Title')
    })

    it('And a created blog can be liked.', function() {
      cy.contains('Create Blog').click()
      cy.get('[data-testid="title-input"]').type('Test Title')
      cy.get('[data-testid="author-input"]').type('Test Author')
      cy.get('[data-testid="url-input"]').type('Test Url')
      cy.get('[data-testid="create-blog-button"]').click()
      cy.get('[data-testid="bloglist"]').contains('Test Title')
      cy.get('[data-testid="view-button"]').click()
      cy.get('[data-testid="likes"]').contains('0')
      cy.get('[data-testid="like-button"]').click()
      cy.get('[data-testid="likes"]').contains('1')
    })

    describe('If a blog exists.', function() {
      beforeEach(function() {
        cy.contains('Create Blog')
          .click()
        cy.get('[data-testid="title-input"]')
          .type('Test Title')
        cy.get('[data-testid="author-input"]')
          .type('Test Author')
        cy.get('[data-testid="url-input"]')
          .type('Test Url')
        cy.get('[data-testid="create-blog-button"]')
          .click()
        cy.get('[data-testid="bloglist"]')
          .contains('Test Title')
      })

      it('The blog can be deleted by its creator.', function() {
        cy.get('[data-testid="view-button"]')
          .click()
        cy.get('[data-testid="delete-button"]')
          .click()
      })

      it('Another user doesnt have the delete the blog button.', function() {
        const user = {
          username: 'anotheruser',
          name: 'Another User',
          password: 'salasana'
        }

        cy.request('POST', 'http://localhost:3003/api/users', user)
          .then(() => {
            cy.login(user)
            cy.get('[data-testid="view-button"]')
              .click()
            cy.get('[data-testid="delete-button"]')
              .should('not.exist')
          })
      })
    })

    describe('If many blogs exist (3 blogs).', function() {
      beforeEach(function() {
        cy.contains('Create Blog')
          .click()
        cy.get('[data-testid="title-input"]')
          .type('First Title')
        cy.get('[data-testid="author-input"]')
          .type('First Author')
        cy.get('[data-testid="url-input"]')
          .type('First Url')
        cy.get('[data-testid="create-blog-button"]')
          .click()
        cy.contains('First Title')

        cy.contains('Create Blog')
          .click()
        cy.get('[data-testid="title-input"]')
          .type('Second Title')
        cy.get('[data-testid="author-input"]')
          .type('Second Author')
        cy.get('[data-testid="url-input"]')
          .type('Second Url')
        cy.get('[data-testid="create-blog-button"]')
          .click()
        cy.contains('Second Title')

        cy.contains('Create Blog')
          .click()
        cy.get('[data-testid="title-input"]')
          .type('Third Title')
        cy.get('[data-testid="author-input"]')
          .type('Third Author')
        cy.get('[data-testid="url-input"]')
          .type('Third Url')
        cy.get('[data-testid="create-blog-button"]')
          .click()
        cy.contains('Third Title')
      })

      it('The blogs are sorted by like count.', function() {
        // Simppeli 'manuaali' ratkaisu.
        const clickWaitDuration = 500

        // Open the first blogs full view.
        cy.get('[data-testid="view-button"]')
          .eq(0)
          .click()
          .wait(clickWaitDuration)

        // Like the first blog 3 times.
        cy.get('[data-testid="like-button"]')
          .click()
          .wait(clickWaitDuration)
          .click()
          .wait(clickWaitDuration)
          .click()
          .wait(clickWaitDuration)

        // Close the first blog.
        cy.get('[data-testid="hide-button"]')
          .eq(0)
          .click()
          .wait(clickWaitDuration)

        // Open the second blogs full view.
        cy.get('[data-testid="view-button"]')
          .eq(1)
          .click()
          .wait(clickWaitDuration)

        // Like the second blog 4 times.
        cy.get('[data-testid="like-button"]')
          .click()
          .wait(clickWaitDuration)
          .click()
          .wait(clickWaitDuration)
          .click()
          .wait(clickWaitDuration)
          .click()
          .wait(clickWaitDuration)

        // Close the second blog.
        cy.get('[data-testid="hide-button"]')
          .eq(0)
          .click()
          .wait(clickWaitDuration)

        // Now the second blog has more likes and should be the first one in the bloglist.
        cy.get('[data-testid="blog"]')
          .its(0)
          .should('contain', 'Second Title')

        // The first title should be the second one on the list.
        cy.get('[data-testid="blog"]')
          .its(1)
          .should('contain', 'First Title')

        // Now we start liking the third blog which has 0 likes.

        // Open the third blogs full view.
        cy.get('[data-testid="view-button"]')
          .eq(2)
          .click()
          .wait(clickWaitDuration)

        // Like the third blog 5 times.
        cy.get('[data-testid="like-button"]')
          .click()
          .wait(clickWaitDuration)
          .click()
          .wait(clickWaitDuration)
          .click()
          .wait(clickWaitDuration)
          .click()
          .wait(clickWaitDuration)
          .click()
          .wait(clickWaitDuration)

        // Close the third blog.
        cy.get('[data-testid="hide-button"]')
          .eq(0)
          .click()
          .wait(clickWaitDuration)

        // Now we check the order. We know that the third blog has 5 likes, second blog 4 and first blog 3.
        cy.get('[data-testid="blog"]')
          .its(0)
          .should('contain', 'Third Title')

        cy.get('[data-testid="blog"]')
          .its(1)
          .should('contain', 'Second Title')

        cy.get('[data-testid="blog"]')
          .its(2)
          .should('contain', 'First Title')
      })
    })
  })
})