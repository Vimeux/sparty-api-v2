const controller = require('../controllers/participation.controller')
const authJwt = require('../middleware/authJwt')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.post(
    '/api/participation',
    [
      authJwt.verifyToken
    ],
    controller.participate
  )

  app.get(
    '/api/participation',
    [
      authJwt.verifyToken
    ],
    controller.getParticipants
  )

  app.put(
    '/api/participation',
    [
      authJwt.verifyToken
    ],
    controller.updateParticipant
  )

  app.delete(
    '/api/participation',
    [
      authJwt.verifyToken
    ],
    controller.deleteParticipant
  )
}
