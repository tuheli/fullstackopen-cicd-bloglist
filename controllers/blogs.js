const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })

  return response
    .status(200)
    .json(blogs)
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
  if (request.body.url === undefined || request.body.url === '') {
    return response
      .status(400)
      .end()
  }

  if (request.body.title === undefined || request.body.title === '') {
    return response
      .status(400)
      .end()
  }

  const user = request.user

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()

  return response
    .status(201)
    .json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  // Currently no login is needed to like a blog.
  if (request.body.url === undefined) {
    return response
      .status(400)
      .end()
  }

  if (request.body.title === undefined) {
    return response
      .status(400)
      .end()
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true, context: 'query' })

  if (updatedBlog === null) {
    return response
      .status(404)
      .send({ error: 'Blog doesnt exist on the server.' })
  }

  response
    .status(200)
    .json(updatedBlog)
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {
  const user = request.user
  const blogToDelete = await Blog.findById(request.params.id)

  if (blogToDelete && blogToDelete.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
  }

  response
    .status(204)
    .end()
})

module.exports = blogsRouter