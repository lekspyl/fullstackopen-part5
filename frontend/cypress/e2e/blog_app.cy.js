describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Cypress User',
      username: 'cypress',
      password: 'testing'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('Login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('cypress')
      cy.get('#password').type('testing')
      cy.get('#login-button').click()
      cy.get('html').should('contain', 'Logged in as cypress')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('cypress')
      cy.get('#password').type('wrongpass')
      cy.get('#login-button').click()

      cy.get('.popupError')
        .should('contain', 'Wrong credentials')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
        .should('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Logged in as cypress')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'cypress', password: 'testing' })
    })

    it('Blogs can be created', function() {
      cy.createBlog({
        author: 'Cypress Test Author',
        title: 'A Test Blog',
        url: 'http://example.com'
      })
      cy.createBlog({
        author: 'A New Cypress Test Author',
        title: 'A New Test Blog',
        url: 'http://example.com.ua'
      })

      cy.contains('A Test Blog').contains('view details')
      cy.contains('A New Test Blog').contains('view details')

    })

    it('A blog can be liked', function () {
      cy.createBlog({
        author: 'Cypress Test Author',
        title: 'A Test Blog',
        url: 'http://example.com'
      })

      cy.contains('A Test Blog')
        .contains('view details').click()
      cy.contains('A Test Blog').contains('Likes').contains('0')
      cy.contains('A Test Blog')
        .contains('like').click()
      cy.contains('A Test Blog').contains('Likes').contains('1')
      cy.contains(/^Liked A Test Blog blog$/)
    })

    it('Blogs are ordered according to likes', function () {
      cy.createBlog({
        author: 'Cypress Test Author',
        title: 'A Test Blog',
        url: 'http://example.com',
      })
      cy.createBlog({
        author: 'A New Cypress Test Author',
        title: 'A New Test Blog',
        url: 'http://example.com.ua',
      })

      cy.contains('A New Test Blog')
        .contains('view details').click()
      cy.contains('A New Test Blog')
        .contains('like').click()
      cy.wait(500)
      cy.get('.blog').eq(0).should('contain', 'A New Test Blog')
      cy.get('.blog').eq(1).should('contain', 'A Test Blog')
    })

    describe('Blog deletion', function () {
      it('Succeessful for the blog creator', function () {
        cy.createBlog({
          author: 'Cypress Test Author',
          title: 'A Test Blog',
          url: 'http://example.com'
        })

        cy.contains('A Test Blog')
          .contains('view details').click()
        cy.contains('A Test Blog')
          .contains('delete').click()
        cy.contains('Deleted A Test Blog blog')
        cy.get('html').should('not.contain', /^A Test Blog$/)
      })

      it('Not allowed for any other user', function () {
        cy.createBlog({
          author: 'Cypress Test Author',
          title: 'A Test Blog',
          url: 'http://example.com'
        })

        cy.request('POST', 'http://localhost:3003/api/users/', {
          name: 'Another User',
          username: 'another',
          password: 'testing'
        })
        cy.get('#logout-button').click()
        cy.get('#username').type('another')
        cy.get('#password').type('testing')
        cy.get('#login-button').click()

        cy.contains('A Test Blog')
          .contains('view details').click()
          .contains('delete').should('not.exist')
      })
    })


  })
})
