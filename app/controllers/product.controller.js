const db = require('../models')
const Product = db.product

exports.createProduct = (req, res) => {
  const { name } = req.body

  if (!name) return res.status(400).send({ message: 'Please fill all the required fields.' })

  Product.create({
    name: req.body.name
  })
    .then(product => {
      res.status(200).send({
        message: 'Product was created successfully!',
        product
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.getProduct = (req, res) => {
  const id = req.query.id
  if (id) {
    // if id is present, get the product with the given id
    Product.findOne({
      where: {
        id
      }
    })
      .then(product => {
        res.status(200).send({
          message: 'Product was retrieved successfully!',
          product
        })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  } else {
    // if id is not present, get all products
    Product.findAll()
      .then(products => {
        if (products.length <= 0) {
          res.status(200).send({
            message: 'No products found!',
            products
          })
        }
        res.status(200).send({
          message: 'Products were retrieved successfully!',
          products
        })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  }
}

exports.updateProduct = (req, res) => {
  const id = req.query.id
  if (id) {
    // if id is present, update the product with the given id
    Product.findOne({
      where: {
        id
      }
    })
      .then(product => {
        product.update({
          name: req.body.name
        })
          .then(product => {
            if (!product) return res.status(404).send({ message: 'Product not found!' })
            res.status(200).send({
              message: 'Product was updated successfully!',
              product
            })
          })
          .catch(err => {
            res.status(500).send({ message: err.message })
          })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  }
}

exports.deleteProduct = (req, res) => {
  const id = req.query.id
  if (id) {
    // if id is present, delete the product with the given id
    Product.findOne({
      where: {
        id
      }
    })
      .then(product => {
        product.destroy()
          .then(() => {
            res.status(200).send({
              message: 'Product was deleted successfully!'
            })
          })
          .catch(err => {
            res.status(500).send({ message: err.message })
          })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  }
}
