const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe("When new user is created", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })
    
  test('responds with an error if username is less than 3 characters long', async () => {
    const user = {
      username: "us",
      name: "User",
      password: "Password",
    }
    const response = await api
      .post('/api/users')
      .send(user)
      .expect(404)
    const error = response.body
    expect(error.error).toBeDefined()
  })

  test('responds with an error if password is less than 3 characters long', async () => {
    const user = {
      username: "usr",
      name: "User",
      password: "Pd",
    }
    const response = await api
      .post('/api/users')
      .send(user)
      .expect(404)
    const error = response.body
    expect(error.error).toBeDefined()
  })

  test('adds user if no validation error found', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = {
      username: "username",
      password: "password",
      name: "name"
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames.includes(user.username)).toBe(true)
  }, 200000)

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    const included = result.body.error.includes('expected `username` to be unique')
    expect(included).toBe(true)

    expect(usersAtEnd.length).toBe(usersAtStart.length)
  }, 20000)
})

afterAll(async () => {
  await mongoose.connection.close()
})