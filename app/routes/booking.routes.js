const controller = require('../controllers/booking.controller')
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
    '/api/booking',
    [
      authJwt.verifyToken
    ],
    controller.createBooking
  )

  app.get(
    '/api/booking',
    [
      authJwt.verifyToken
    ],
    controller.getBookingByUser
  )

  app.get(
    '/api/booking/place',
    [
      authJwt.verifyToken
    ],
    controller.getBookingByPlace
  )
}
