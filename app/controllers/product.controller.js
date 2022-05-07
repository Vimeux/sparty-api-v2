const db = require('../models')
const Product = db.product

exports.createProduct = async (req, res) => {
  const { name } = req.body

  if (!name) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    const product = await Product.create({
      name
    })
    return res.status(200).send({
      message: 'Product was created successfully!',
      product
    })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

exports.getProduct = async (req, res) => {
  const id = req.query.id

  try {
    if (id) {
      const product = await Product.findOne({
        where: {
          id
        }
      })
      if (!product) return res.status(404).send({ message: 'Product not found!' })
      return res.status(200).send({
        message: 'Product was found successfully!',
        product
      })
    } else {
      const products = await Product.findAll()
      if (!products) return res.status(404).send({ message: 'Products not found!' })
      return res.status(200).send({
        message: 'Products were found successfully!',
        products
      })
    }
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

exports.updateProduct = async (req, res) => {
  const id = req.query.id
  const { name } = req.body

  if (!id) return res.status(400).send({ message: 'Please provide a product id.' })
  if (!name) return res.status(400).send({ message: 'Please provide a product name.' })

  try {
    const product = await Product.findOne({
      where: {
        id
      }
    })
    if (!product) return res.status(404).send({ message: 'Product not found!' })
    product.name = name
    await product.save()
    return res.status(200).send({
      message: 'Product was updated successfully!',
      product
    })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

exports.deleteProduct = async (req, res) => {
  const id = req.query.id

  if (!id) return res.status(400).send({ message: 'Please provide a product id.' })

  try {
    const product = await Product.findOne({
      where: {
        id
      }
    })
    if (!product) return res.status(404).send({ message: 'Product not found!' })
    await product.destroy()
    return res.status(200).send({ message: 'Product was deleted successfully!' })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }

  // if (id) {
  //   // if id is present, delete the product with the given id
  //   Product.findOne({
  //     where: {
  //       id
  //     }
  //   })
  //     .then(product => {
  //       product.destroy()
  //         .then(() => {
  //           res.status(200).send({
  //             message: 'Product was deleted successfully!'
  //           })
  //         })
  //         .catch(err => {
  //           res.status(500).send({ message: err.message })
  //         })
  //     })
  //     .catch(err => {
  //       res.status(500).send({ message: err.message })
  //     })
  // }
}
