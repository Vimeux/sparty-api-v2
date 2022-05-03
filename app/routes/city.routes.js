const controller = require('../controllers/city.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.post(
    '/api/city',
    controller.createCity
  )

  app.get(
    '/api/city',
    controller.getCity
  )

  app.put(
    '/api/city',
    controller.updateCity
  )

  app.delete(
    '/api/city',
    controller.deleteCity
  )
}
