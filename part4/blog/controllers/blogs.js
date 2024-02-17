const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

const getDecodedToken = (request, response, next) => {
  try {
    const decodedToken = jwt.verify(
      request.token, 
      process.env.SECRET,
      { expiresIn: 60*60 }
    )
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
  try {
    const blogs = await Blog.find({}).populate('user')
    logger.info(`db blogs: ${blogs}`)
    response.json(blogs)
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  logger.info(`post request body:`, request.body)
  const user = request.user
  if (!user) {
    const error = {
      error: "Invalid Token"
    }
    return response.status(401).json(error)
  }

  const item = {
    user: user.id,
    likes: request.body.likes || 0,
    ...request.body
  }
  if (!item.title || !item.url) {
    return response.status(404).end()
  }
  const blog = new Blog(item)
  try {
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
  } catch(error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  logger.info(`delete request body:`, request.body)

  const user = request.user
  if (!user) {
    const error = {
      error: "Invalid Token"
    }
    return response.status(401).json(error)
  }

  const id = request.params.id
  logger.info('params id', id)
  const blog = await Blog.findById(id)
  if (blog.user.toString() !== user._id.toString()) {
    const error = {
      error: "Unauthorized user"
    }
    return response.status(401).json(error)
  }
  try {
    user.blogs = user.blogs.filter(b => b.toString() !== id)
    await Blog.findByIdAndDelete(id)
    user.save()
    response.status(204).end() 
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  logger.info(`delete request body:`, request.body)
  const id = request.params.id
  logger.info('params id', id)
  const opts = { new: true }
  try {
    const result = await Blog.findByIdAndUpdate(id, request.body, opts)
    response.json(result)
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter