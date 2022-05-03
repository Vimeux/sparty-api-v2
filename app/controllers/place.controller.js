const { extractIdFromRequestAuthHeader } = require('../helpers/tokenHelper')
const db = require('../models')
const Place = db.place
const Feature = db.feature
const Op = db.Sequelize.Op

exports.createPlace = (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)
  const { name, description, address, latitude, longitude, maxPersons, price, features, cityId, placeTypeId } = req.body

  if (!name || !description || !address || !latitude || !longitude || !maxPersons || !price) {
    return res.status(400).send({ message: 'Please fill all the required fields.' })
  }

  // Save Place to data base
  Place.create({
    name,
    description,
    address,
    latitude,
    longitude,
    maxPersons,
    price,
    userId: id,
    cityId,
    placeTypeId
  })
    .then(place => {
      if (features) {
        // if features are present, add them to the place
        Feature.findAll({
          where: {
            name: {
              [Op.in]: features
            }
          }
        })
          .then(features => {
            place.setFeatures(features)
          })
          .catch(err => {
            res.status(500).send({ message: err.message })
          })
      }
      res.status(200).send({
        message: 'Place was created successfully!',
        place
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.getPlace = (req, res) => {
  const id = req.query.id

  if (id) {
    // if id is present, get the place with the given id
    Place.findOne({
      where: {
        id
      },
      include: [
        {
          model: db.user,
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: db.feature,
          attributes: ['name']
        },
        {
          model: db.city,
          attributes: ['name']
        },
        {
          model: db.placeType,
          attributes: ['name']
        }
      ]
    })
      .then(place => {
        res.status(200).send({
          message: 'Place was retrieved successfully!',
          place
        })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  } else {
    // if id is not present, get all places
    Place.findAll({
      include: [
        {
          model: db.user,
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: db.feature,
          attributes: ['name']
        },
        {
          model: db.city,
          attributes: ['name']
        },
        {
          model: db.placeType,
          attributes: ['name']
        }
      ]
    })
      .then(places => {
        res.status(200).send({
          message: 'Places were retrieved successfully!',
          places
        })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  }
}

exports.updatePlace = (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)

  // find place by id
  Place.findOne({
    where: {
      id: req.query.id
    }
  })
    .then(place => {
      // if place is not found
      if (!place) return res.status(404).send({ message: 'Place Not found.' })
      // if the place does not belong to the user
      if (place.userId !== id) return res.status(401).send({ message: 'Unauthorized.' })

      // update place
      place
        .update({
          name: req.body.name,
          description: req.body.description,
          address: req.body.address,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          maxPersons: req.body.maxPersons,
          price: req.body.price,
          cityId: req.body.cityId,
          placeTypeId: req.body.placeTypeId
        })
        .then(() => {
          if (req.body.features) {
            // if features are present, add them to the place
            Feature.findAll({
              where: {
                name: {
                  [Op.in]: req.body.features
                }
              }
            })
              .then(features => {
                place.setFeatures(features)
              })
              .catch(err => {
                res.status(500).send({ message: err.message })
              })
          }
          res.status(200).send({
            message: 'Place was updated successfully!',
            place
          })
        })
        .catch(err => {
          res.status(500).send({ message: err.message })
        })
    })
}

exports.deletePlace = (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)

  // find place by id
  Place.findOne({
    where: {
      id: req.query.id
    }
  })
    .then(place => {
      // if place is not found
      if (!place) return res.status(404).send({ message: 'Place Not found.' })
      // if the place does not belong to the user
      if (place.userId !== id) return res.status(401).send({ message: 'Unauthorized.' })

      // delete place
      place
        .destroy()
        .then(() => {
          res.status(200).send({
            message: 'Place was deleted successfully!'
          })
        })
        .catch(err => {
          res.status(500).send({ message: err.message })
        })
    })
}
