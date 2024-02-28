const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

const getDecodedToken = (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET, {
      expiresIn: 60 * 60,
    })
    if (!decodedToken.id) {
      response.status(401).json({ error: 'token invalid' })
      return null
    }
    return decodedToken
  } catch (error) {
    next(error)
  }
}

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate(['user', 'comments'])
  logger.info(`db blogs: ${blogs.length}`)
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  logger.info(`post request body:`, request.body)
  const user = request.user
  if (!user) {
    const error = {
      error: 'Invalid Token',
    }
    return response.status(401).json(error)
  }

  const item = {
    user: user.id,
    likes: request.body.likes || 0,
    ...request.body,
  }
  if (!item.title || !item.url) {
    return response.status(404).end()
  }
  const blog = new Blog(item)
  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  result.user = user
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  logger.info(`delete request body:`, request.body)

  const user = request.user
  if (!user) {
    const error = {
      error: 'Invalid Token',
    }
    return response.status(401).json(error)
  }

  const id = request.params.id
  logger.info('params id', id)
  const blog = await Blog.findById(id)
  if (blog.user.toString() !== user._id.toString()) {
    const error = {
      error: 'Unauthorized user',
    }
    return response.status(401).json(error)
  }

  user.blogs = user.blogs.filter((b) => b.toString() !== id)
  await Blog.findByIdAndDelete(id)
  user.save()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  logger.info(`delete request body:`, request.body)

  const user = request.user
  if (!user) {
    const error = {
      error: 'Invalid Token',
    }
    return response.status(401).json(error)
  }

  const id = request.params.id
  logger.info('params id', id)
  const blog = await Blog.findById(id)
  if (blog.user.toString() !== user._id.toString()) {
    const error = {
      error: 'Unauthorized user',
    }
    return response.status(401).json(error)
  }

  const opts = { new: true }
  const result = await Blog.findByIdAndUpdate(id, request.body, opts)
  response.json(result)
})

module.exports = blogsRouter
