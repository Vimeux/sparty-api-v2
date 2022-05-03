const controller = require('../controllers/party.controller')
const authJwt = require('../middleware/authJwt')
const partyCheck = require('../middleware/partyCheck')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.post(
    '/api/party',
    [
      authJwt.verifyToken,
      partyCheck.checkPartyExisted
    ],
    controller.createParty
  )

  app.get(
    '/api/party',
    [
      authJwt.verifyToken
    ],
    controller.getParty
  )

  app.get(
    '/api/party/all',
    [
      authJwt.isAdmin
    ],
    controller.getAllParties
  )

  app.put(
    '/api/party',
    [
      authJwt.verifyToken
    ],
    controller.updateParty
  )

  app.delete(
    '/api/party',
    [
      authJwt.verifyToken
    ],
    controller.deleteParty
  )
}
