const controller = require('../controllers/product.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.post(
    '/api/product',
    controller.createProduct
  )

  app.get(
    '/api/product',
    controller.getProduct
  )

  app.put(
    '/api/product',
    controller.updateProduct
  )

  app.delete(
    '/api/product',
    controller.deleteProduct
  )
}
