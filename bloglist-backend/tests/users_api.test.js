const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)

const timeout = 30000

beforeEach(async () => {
  await User.deleteMany({})
}, timeout)

test('users can be saved', async () => {
  await Promise.all(helper.initialUsers.map(user => helper.saveUser(user)))

  const response = await api
    .get('/api/users')
    .expect(200)

  console.log(response.body)
  expect(response.body).toHaveLength(helper.initialUsers.length)
}, timeout)

test('user can login and gets a token', async () => {
  const user = helper.initialUsers[0]
  await helper.saveUser(user)

  const loginResponse = await api
    .post('/api/login')
    .send({ username: user.username, password: user.password })
    .expect(200)

  expect(loginResponse.body.token).toBeDefined()
}, timeout)

test('password must be defined', async () => {
  const newUser = {
    username: 'idonthavepassword',
    name: 'Test User',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
}, timeout)

test('password length has to be at least 3', async () => {
  const newUser = {
    username: 'shortpassword',
    name: 'Test User',
    password: '12'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
}, timeout)

test('username has to be unique', async () => {
  const newUser = {
    username: 'test_user_1',
    name: 'Test User',
    password: 'password1234'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const errorMessage = response.body.error
  expect(errorMessage).toBeDefined()
  expect(errorMessage).toMatch('User validation failed: username: Error, expected `username` to be unique.')
}, timeout)

test('error message is appropriate when password is not defined', async () => {
  const newUser = {
    username: 'idonthavepassword',
    name: 'Test User',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const errorMessage = response.body.error
  expect(errorMessage).toBeDefined()
  expect(errorMessage).toBe('Password undefined.')
}, timeout)

test('error message is appropriate when password length is too short', async () => {
  const newUser = {
    username: 'shortpassword',
    name: 'Test User',
    password: '12'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const errorMessage = response.body.error
  expect(errorMessage).toBeDefined()
  expect(errorMessage).toBe('Password length less than 3.')
}, timeout)

afterAll(async () => {
  await mongoose.connection.close()
}, timeout)