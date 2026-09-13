const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  const token = authorization.split(' ')[1]

  try {
    const { _id } = jwt.verify(token, process.env.SECRET)
    req.user = await User.findOne({ _id }).select('_id email username role')
    if (!req.user) {
      return res.status(401).json({ error: 'Request is not authorized' })
    }
    next()
  } catch (error) {
    res.status(401).json({ error: 'Request is not authorized' })
  }
}

const requireHost = (req, res, next) => {
  if (!req.user || req.user.role !== 'host') {
    return res.status(403).json({ error: 'Host access only' })
  }
  next()
}

module.exports = { requireAuth, requireHost }
