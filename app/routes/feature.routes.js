const controller = require('../controllers/feature.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.post(
    '/api/feature',
    controller.createFeature
  )

  app.get(
    '/api/feature',
    controller.getFeature
  )

  app.put(
    '/api/feature',
    controller.updateFeature
  )

  app.delete(
    '/api/feature',
    controller.deleteFeature
  )
}
