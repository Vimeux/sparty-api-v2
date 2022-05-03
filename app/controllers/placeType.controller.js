const db = require('../models')
const PlaceType = db.placeType

exports.createPlaceType = (req, res) => {
  PlaceType.create({
    name: req.body.name
  })
    .then(placeType => {
      res.status(200).send({
        message: 'PlaceType was created successfully!',
        placeType
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.getPlaceType = (req, res) => {
  const id = req.query.id
  if (id) {
    // if id is present, get the placeType with the given id
    PlaceType.findOne({
      where: {
        id
      }
    })
      .then(placeType => {
        res.status(200).send({
          message: 'PlaceType was retrieved successfully!',
          placeType
        })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  } else {
    // if id is not present, get all placeTypes
    PlaceType.findAll()
      .then(placeTypes => {
        if (placeTypes.length <= 0) {
          res.status(200).send({
            message: 'No placeTypes found!',
            placeTypes
          })
        }
        res.status(200).send({
          message: 'PlaceTypes were retrieved successfully!',
          placeTypes
        })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  }
}

exports.updatePlaceType = (req, res) => {
  const id = req.query.id
  if (id) {
    // if id is present, update the placeType with the given id
    PlaceType.findOne({
      where: {
        id
      }
    })
      .then(placeType => {
        if (!placeType) return res.status(404).send({ message: 'PlaceType not found!' })
        placeType.update({
          name: req.body.name
        })
          .then(placeType => {
            res.status(200).send({
              message: 'PlaceType was updated successfully!',
              placeType
            })
          })
          .catch(err => {
            res.status(500).send({ message: err.message })
          })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  } else {
    res.status(400).send({ message: 'Id is required!' })
  }
}

exports.deletePlaceType = (req, res) => {
  const id = req.query.id
  if (id) {
    // if id is present, delete the placeType with the given id
    PlaceType.findOne({
      where: {
        id
      }
    })
      .then(placeType => {
        if (!placeType) return res.status(404).send({ message: 'PlaceType not found!' })
        placeType.destroy()
          .then(() => {
            res.status(200).send({
              message: 'PlaceType was deleted successfully!'
            })
          })
          .catch(err => {
            res.status(500).send({ message: err.message })
          })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  } else {
    res.status(400).send({ message: 'Id is required!' })
  }
}
