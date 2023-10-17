const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const api = supertest(app)

const timeout = 60000

let headers

const saveBlog = async blog => {
  const newBlog = {
    ...blog
  }

  const result = await api
    .post('/api/blogs')
    .set(headers)
    .send(newBlog)

  return result
}

describe('With some blogs in the database.', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = {
      ...helper.initialUsers[0]
    }

    await api
      .post('/api/users')
      .send(newUser)

    const loginResult = await api
      .post('/api/login')
      .send({
        username: newUser.username,
        password: newUser.password,
      })

    headers = {
      'Authorization': `Bearer ${loginResult.body.token}`
    }

    await Promise.all(helper.initialBlogs.map(blog => saveBlog(blog)))
  }, timeout)

  test('Correct amount of blogs are returned as json.', async () => {
    const result = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = result.body

    expect(blogs).toHaveLength(helper.initialBlogs.length)
  }, timeout)

  test('Returned blogs have an id field.', async () => {
    const result = await api
      .get('/api/blogs')

    const blogs = result.body

    blogs.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  }, timeout)

  test('A new blog can be added.', async () => {
    const firstResult = await api
      .get('/api/blogs')

    const initialBlogCount = firstResult.body.length

    const newBlog = {
      title: 'Not in initial blogs',
      author: 'Mikael T',
      url: 'https://reactterns.com/',
      likes: 923823,
    }

    await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)

    const secondResult = await api
      .get('/api/blogs')

    const updatedBlogCount = secondResult.body.length
    const addedBlog = secondResult.body.find(blog => blog.title === newBlog.title && blog.likes === newBlog.likes)

    expect(updatedBlogCount).toEqual(initialBlogCount + 1)
    expect(addedBlog).toBeDefined()
  }, timeout)

  test('Blog can be deleted.', async () => {
    const firstResult = await api
      .get('/api/blogs')

    const initialBlogs = firstResult.body
    const blogToDelete = {
      ...initialBlogs[0]
    }

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(headers)
      .expect(204)

    const secondResult = await api
      .get('/api/blogs')

    const updatedBlogs = secondResult.body
    const undefinedBlog = updatedBlogs.find(blog => blog.id === blogToDelete.id)

    expect(updatedBlogs).toHaveLength(initialBlogs.length - 1)
    expect(undefinedBlog).not.toBeDefined()
  }, timeout)

  test('Blog can be updated (liked).', async () => {
    const firstResult = await api
      .get('/api/blogs')

    const initialBlogs = firstResult.body
    const originalBlog = initialBlogs[1]

    const blogToUpdate = {
      ...originalBlog,
      title: 'Updated Blog Title',
      user: originalBlog.user.id,
      likes: originalBlog.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set(headers)
      .send(blogToUpdate)
      .expect(200)

    const secondResult = await api
      .get('/api/blogs')

    const updatedBlogs = secondResult.body
    const updatedBlog = updatedBlogs.find(blog => blog.id === originalBlog.id)

    expect(updatedBlog.title).toEqual('Updated Blog Title')
  })
}, timeout)

describe('Without initial blogs in the database.', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = {
      ...helper.initialUsers[0]
    }

    await api
      .post('/api/users')
      .send(newUser)

    const loginResult = await api
      .post('/api/login')
      .send({
        username: newUser.username,
        password: newUser.password,
      })

    headers = {
      'Authorization': `Bearer ${loginResult.body.token}`
    }
  }, timeout)

  test('When adding a blog without likes field it defaults to 0.', async () => {
    const newBlog = {
      title: 'Not in initial blogs',
      author: 'Mikael T',
      url: 'https://reactterns.com/',
      // likes: 923823,
    }

    const result = await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)

    const addedBlog = result.body

    expect(addedBlog.likes).toBeDefined()
    expect(addedBlog.likes).toEqual(0)
  }, timeout)

  test('Trying to add a blog without url gets response code 400', async () => {
    const newBlog = {
      title: 'Not in initial blogs',
      author: 'Mikael T',
      // url: 'https://reactterns.com/',
      likes: 923823,
    }

    await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(400)
  }, timeout)

  test('Trying to add a blog without title gets response code 400', async () => {
    const newBlog = {
      // title: 'Not in initial blogs',
      author: 'Mikael T',
      url: 'https://reactterns.com/',
      likes: 923823,
    }

    await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(400)
  }, timeout)
})

describe('Without a token.', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
  }, timeout)

  test('A blog wont be added.', async () => {
    const firstResult = await api
      .get('/api/blogs')

    const initialBlogCount = firstResult.body.length

    const newBlog = {
      ...helper.initialBlogs[0]
    }

    await api
      .post('/api/blogs')
      .send(newBlog)

    const secondResult = await api
      .get('/api/blogs')

    const updatedBlogCount = secondResult.body.length

    expect(initialBlogCount).toEqual(updatedBlogCount)
  }, timeout)

  test('Trying to add blog responds with status 401.', async () => {
    const newBlog = {
      ...helper.initialBlogs[0]
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  }, timeout)
})

afterAll(async () => {
  await mongoose.connection.close()
})