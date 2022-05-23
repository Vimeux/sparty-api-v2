const { extractIdFromRequestAuthHeader } = require('../helpers/tokenHelper')
const db = require('../models')
const Party = db.party
const Product = db.product

exports.createParty = async (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)
  const { name, budget, invitationCode, date, maxPersonn, products } = req.body

  if (!name || !budget || !invitationCode || !date || !maxPersonn) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    const party = await Party.create({
      name,
      budget,
      invitationCode,
      date,
      maxPersonn,
      userId: id
    })
    if (products) {
      try {
        await products.map(async product => {
          const productToAdd = await Product.findOne({
            where: {
              name: product.name
            }
          })
          if (!productToAdd) {
            const newProduct = await Product.create({
              name: product.name
            })
            await party.addProduct(newProduct, { through: { quantity: product.quantity } })
          }

          await party.addProducts(productToAdd, { through: { quantity: product.quantity } })
        })
      } catch (error) {
        await party.destroy()
        return res.status(500).send({ message: error.message })
      }
    }
    return res.status(200).send({
      message: 'Party was created successfully!',
      party
    })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

exports.getParty = async (req, res) => {
  const userid = extractIdFromRequestAuthHeader(req)
  const id = req.query.id

  try {
    if (id) {
      const party = await Party.findOne({
        where: {
          id
        },
        include: [
          {
            model: Product,
            through: {
              attributes: ['quantity']
            }
          },
          {
            model: db.user,
            as: 'users',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      })
      // Check if party exists
      if (!party) return res.status(404).send({ message: 'Party Not found.' })
      // Check if party belongs to user
      return res.status(200).send({
        message: 'Party was retrieved successfully!',
        party
      })
    } else {
      // get all parties and participation of user
      const parties = await Party.findAll({
        where: {
          userId: userid
        },
        include: [
          {
            model: Product,
            through: {
              attributes: ['quantity']
            }
          },
          {
            model: db.user,
            as: 'users',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      })
      // Check if parties exists
      if (!parties) return res.status(404).send({ message: 'No parties found!' })

      const participation = await Party.findAll({
        include: [
          {
            model: db.user,
            as: 'users',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            where: {
              id: userid
            }
          }
        ]
      })

      return res.status(200).send({
        message: 'Parties were retrieved successfully!',
        parties,
        participation
      })
    }
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

exports.getAllParties = async (req, res) => {
  try {
    const parties = await Party.findAll({
      include: [
        {
          model: Product,
          through: {
            attributes: ['quantity']
          }
        },
        {
          model: db.user,
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: db.user,
          as: 'users',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    })
    // Check if parties exists
    if (!parties) return res.status(404).send({ message: 'No parties found!' })
    return res.status(200).send({
      message: 'Parties were retrieved successfully!',
      parties
    })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

exports.updateParty = async (req, res) => {
  const userId = extractIdFromRequestAuthHeader(req)
  const { budget, date, maxPersonn, products } = req.body
  const id = req.query.id
  // Save Party to data base
  try {
    const party = await Party.findOne({
      where: {
        id
      }
    })
    if (!party) return res.status(404).send({ message: 'Party Not found.' })
    if (party.userId !== userId) return res.status(401).send({ message: 'Unauthorized.' })
    const partyUpdated = await party.update({
      budget,
      date,
      maxPersonn
    })

    if (products) {
      try {
        await partyUpdated.setProducts([])
        await products.map(async product => {
          const productToAdd = await Product.findOne({
            where: {
              name: product.name
            }
          })
          if (!productToAdd) {
            const newProduct = await Product.create({
              name: product.name
            })
            await partyUpdated.addProduct(newProduct, { through: { quantity: product.quantity } })
          }
          await partyUpdated.addProducts(productToAdd, { through: { quantity: product.quantity } })
        })
      } catch (error) {
        return res.status(500).send({ message: error.message })
      }
    }
    return res.status(200).send({
      message: 'Party was updated successfully!',
      partyUpdated
    })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

exports.deleteParty = async (req, res) => {
  const userId = extractIdFromRequestAuthHeader(req)
  const id = req.query.id

  try {
    const party = await Party.findOne({
      where: {
        id
      }
    })
    if (!party) return res.status(404).send({ message: 'Party Not found.' })
    if (party.userId !== userId) return res.status(401).send({ message: 'Unauthorized.' })
    await party.destroy()
    return res.status(200).send({
      message: 'Party was deleted successfully!'
    })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}
