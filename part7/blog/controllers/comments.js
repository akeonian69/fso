const commentsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const logger = require('../utils/logger')

commentsRouter.get('/:blogId/comments', async (request, response, next) => {
  const blogId = request.params.blogId
  const comments = await Comment.find({ blog: blogId }).populate('blog')
  logger.info(`db comments: ${comments.length}`)
  response.json(comments)
})

commentsRouter.post('/:blogId/comments', async (request, response, next) => {
  const blogId = request.params.blogId
  const comment = new Comment({
    ...request.body,
    blog: blogId,
  })
  const blog = await Blog.findById(blogId)
  const saved = await comment.save()
  blog.comments = blog.comments.concat(saved._id)
  await blog.save()
  saved.blog = blog
  logger.info(`db comments saved: ${saved}`)
  response.json(saved)
})

module.exports = commentsRouter
