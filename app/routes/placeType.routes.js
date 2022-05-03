const controller = require('../controllers/placeType.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.post(
    '/api/placeType',
    controller.createPlaceType
  )

  app.get(
    '/api/placeType',
    controller.getPlaceType
  )

  app.put(
    '/api/placeType',
    controller.updatePlaceType
  )

  app.delete(
    '/api/placeType',
    controller.deletePlaceType
  )
}
