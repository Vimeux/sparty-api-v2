const jwt = require('jsonwebtoken')
const config = require('../config/auth.config')

// génération du token (c'est bête mais je précise si jamais j'oublie)
const generateToken = (payload, callback) => {
  // le token est valable 7 jours
  jwt.sign(payload, config.secret, { expiresIn: '7d' }, (error, token) => {
    if (error) callback(error)
    callback(null, token)
  })
}

const extractIdFromRequestAuthHeader = (req, res) => {
  // const authorization = req.headers['x-access-token']
  // console.log(authorization)
  // if (authorization) {
  //   const token = authorization.split(' ')[1]
  //   if (token) {
  //     return jwt.decode(token).id
  //   }
  // }

  const token = req.headers['x-access-token']
  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    })
  } else {
    return jwt.decode(token).id
  }
}

module.exports = {
  generateToken,
  extractIdFromRequestAuthHeader
}
