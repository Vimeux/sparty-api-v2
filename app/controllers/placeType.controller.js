const db = require('../models')
const PlaceType = db.placeType

exports.createPlaceType = async (req, res) => {
  const { name } = req.body

  if (!name) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    const placeType = await PlaceType.create({
      name
    })

    res.status(201).send({
      message: 'PlaceType was created successfully!',
      placeType
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.getPlaceType = async (req, res) => {
  const id = req.query.id

  try {
    if (id) {
      const placeType = await PlaceType.findOne({
        where: {
          id
        }
      })

      res.status(200).send({
        message: 'PlaceType was found successfully!',
        placeType
      })
    } else {
      const placeTypes = await PlaceType.findAll()

      res.status(200).send({
        message: 'PlaceTypes were found successfully!',
        placeTypes
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.updatePlaceType = async (req, res) => {
  const id = req.query.id
  const { name } = req.body

  if (!id) return res.status(400).send({ message: 'Please provide a placeType id.' })
  if (!name) return res.status(400).send({ message: 'Please provide a placeType name.' })

  try {
    const placeType = await PlaceType.findOne({
      where: {
        id
      }
    })
    if (!placeType) return res.status(404).send({ message: 'PlaceType not found!' })

    const updatedPlaceType = await placeType.update({
      name
    })

    res.status(200).send({
      message: 'PlaceType was updated successfully!',
      updatedPlaceType
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.deletePlaceType = async (req, res) => {
  const id = req.query.id

  if (!id) return res.status(400).send({ message: 'Please provide a placeType id.' })

  try {
    const placeType = await PlaceType.findOne({
      where: {
        id
      }
    })
    if (!placeType) return res.status(404).send({ message: 'PlaceType not found!' })

    await placeType.destroy()

    res.status(200).send({
      message: 'PlaceType was deleted successfully!'
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
