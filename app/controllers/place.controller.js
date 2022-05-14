const { extractIdFromRequestAuthHeader } = require('../helpers/tokenHelper')
const db = require('../models')
const Place = db.place
const Feature = db.feature
const Op = db.Sequelize.Op

exports.createPlace = async (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)
  const { name, description, address, latitude, longitude, maxPersons, price, features, cityId, placeTypeId } = req.body

  if (!name || !description || !address || !latitude || !longitude || !maxPersons || !price) {
    return res.status(400).send({ message: 'Please fill all the required fields.' })
  }

  // Save Place to data base
  try {
    const place = await Place.create({
      name,
      description,
      address,
      latitude,
      longitude,
      maxPersons,
      price,
      cityId,
      placeTypeId,
      userId: id
    })

    if (features) {
      // if features are present, add them to the place
      const featuresList = await Feature.findAll({
        where: {
          name: {
            [Op.in]: features
          }
        }
      })
      place.setFeatures(featuresList)
    }

    res.status(201).send({
      message: 'Place was created successfully!',
      place
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.getPlace = async (req, res) => {
  const id = req.query.id

  try {
    if (id) {
      const place = await Place.findOne({
        where: {
          id
        },
        include: [
          {
            model: db.user,
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Feature,
            as: 'features'
          },
          {
            model: db.city,
            as: 'city'
          },
          {
            model: db.placeType,
            as: 'placeType'
          }
        ]
      })
      if (!place) return res.status(404).send({ message: 'Place Not found.' })
      return res.status(200).send({
        message: 'Place was retrieved successfully!',
        place
      })
    } else {
      const places = await Place.findAll({
        include: [
          {
            model: db.user,
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Feature,
            as: 'features'
          },
          {
            model: db.city,
            as: 'city'
          },
          {
            model: db.placeType,
            as: 'placeType'
          }
        ]
      })
      return res.status(200).send({
        message: 'Places were retrieved successfully!',
        places
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.updatePlace = async (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)
  const placeId = req.query.id
  const { name, description, address, latitude, longitude, maxPersons, price, features, cityId, placeTypeId } = req.body

  if (!name || !description || !address || !latitude || !longitude || !maxPersons || !price) {
    return res.status(400).send({ message: 'Please fill all the required fields.' })
  }

  if (!placeId) return res.status(400).send({ message: 'Please provide a place id.' })

  try {
    const place = await Place.findOne({
      where: {
        id: placeId
      }
    })
    if (!place) return res.status(404).send({ message: 'Place Not found.' })
    if (place.userId !== id) return res.status(401).send({ message: 'Unauthorized.' })

    // update place
    const updatedPlace = await place.update({
      name,
      description,
      address,
      latitude,
      longitude,
      maxPersons,
      price,
      cityId,
      placeTypeId
    })

    // update features
    if (features) {
      const featuresList = await Feature.findAll({
        where: {
          name: {
            [Op.in]: features
          }
        }
      })
      updatedPlace.setFeatures(featuresList)
    }

    res.status(200).send({
      message: 'Place was updated successfully!',
      updatedPlace
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.deletePlace = async (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)
  const placeId = req.query.id

  if (!placeId) return res.status(400).send({ message: 'Please provide a place id.' })

  // find place by id
  try {
    const place = await Place.findOne({
      where: {
        id: placeId
      }
    })
    if (!place) return res.status(404).send({ message: 'Place Not found.' })
    if (place.userId !== id) return res.status(401).send({ message: 'Unauthorized.' })

    // delete place
    await place.destroy()

    res.status(200).send({
      message: 'Place was deleted successfully!'
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
