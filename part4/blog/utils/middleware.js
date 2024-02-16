const morgan = require('morgan')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    request.token = token
  }
  next()
}

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(
      request.token, 
      process.env.SECRET
    )
    if (decodedToken.id) {
      request.user = await User.findById(decodedToken.id)
    }
  }
  next()
}

module.exports = {
    tokenExtractor,
    requestLogger,
    userExtractor
  }