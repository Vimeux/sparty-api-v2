const authJwt = require('../middleware/authJwt')
const controller = require('../controllers/place.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.post(
    '/api/place',
    [
      authJwt.verifyToken
    ],
    controller.createPlace
  )

  app.get(
    '/api/place',
    controller.getPlaces
  )

  app.get(
    '/api/place/:id',
    controller.getPlace
  )

  app.put(
    '/api/place/',
    [
      authJwt.verifyToken
    ],
    controller.updatePlace
  )

  app.delete(
    '/api/place/',
    [
      authJwt.verifyToken
    ],
    controller.deletePlace
  )
}
