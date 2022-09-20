const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    let userObj = new User(user)
    await userObj.save()
  }
})

describe('create', () => {
  test('user can be added', async () => {
    await api
      .post('/api/users')
      .send({
        username: 'testUser',
        password: 'testPass',
        name: 'Test User'
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    const usernames = usersAtEnd.map(x => x.username)
    expect(usernames).toContain('testUser')
  })

  test('user without username or password is rejected', async () => {
    await api
      .post('/api/users')
      .send({
        password: 'testPass',
        name: 'Test User'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/users')
      .send({
        username: 'testUser',
        name: 'Test User'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('usernames/password that do not match length validation are rejected', async () => {
    await api
      .post('/api/users')
      .send({
        username: '',
        password: 'testPass',
        name: 'Test User'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/users')
      .send({
        username: 'testUser',
        password: '',
        name: 'Test User'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})
