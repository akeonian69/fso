describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'John Hardy',
      username: 'johnhardy',
      password: 'testpassword'
    }
    cy.createUser(user)
  })
  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  it('login form can be opened', function() {
    cy.get('#username').type('johnhardy')
    cy.get('#password').type('testpassword')
    cy.get('#login-button').click()

    cy.contains('John Hardy logged in')
  })
  it('login fails with wrong password', function() {
    cy.get('#username').type('johnhardy')
    cy.get('#password').type('wrongpassword')
    cy.get('#login-button').click()

    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
    cy.get('.error')
      .should('contain','invalid username or password')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'John Hardy logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      const credentials = {
        username: 'johnhardy',
        password: 'testpassword'
      }
      cy.login(credentials)
    })
    it('a new blog can be created', function() {
      cy.contains('create').click()
      cy.get('#blog-title').type('A new blog to test cypress')
      cy.get('#blog-author').type('Jeff Hardy')
      cy.get('#blog-url').type('https://www.google.com/')
      cy.get('#create-blog-button').click()
      cy.contains('A new blog to test cypress Jeff Hardy')
    })

    describe('and blog exists', function() {
      beforeEach(function() {
        const blog = {
          title: 'A new blog to test cypress',
          author: 'Jeff Hardy',
          url: 'https://www.google.com/'
        }
        cy.createBlog(blog)
      })
      it('User can like a blog', function() {
        cy.contains('A new blog to test cypress').as('blogItem')
        cy.get('@blogItem').contains('view').click()
        cy.get('#like-button').click()

        cy.get('@blogItem').contains('likes 1')
      })
      it('Owner of the blog can remove it', function() {
        cy.contains('A new blog to test cypress').as('blogItem')
        cy.get('@blogItem').contains('view').click()
        cy.get('@blogItem').contains('remove').click()

        cy.contains('A new blog to test cypress').should('not.exist')
      })
      it('Other users cannot see remove button', function() {
        const user = {
          username: 'newuser',
          name: 'New User',
          password: 'userpassword'
        }
        cy.createUser(user)
        cy.login(user)

        cy.contains('A new blog to test cypress').as('blogItem')
        cy.get('@blogItem').contains('view').click()
        cy.get('@blogItem').contains('remove').should('not.exist')
      })
      it('Blogs are ordered by likes', function() {
        const blog = {
          title: 'Test Blog',
          author: 'Test Author',
          url: 'https://www.google.com',
          likes: 4
        }
        cy.createBlog(blog)

        cy.get('.blog').eq(0).should('contain', 'Test Blog')
        cy.get('.blog').eq(1).should('contain', 'A new blog to test cypress')
      })
    })
  })
})