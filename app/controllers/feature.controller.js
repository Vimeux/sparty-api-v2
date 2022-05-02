const db = require('../models')
const Feature = db.feature

exports.createFeature = (req, res) => {
  // Save Place to data base
  Feature.create({
    name: req.body.name
  })
    .then(feature => {
      res.status(200).send({
        message: 'Feature was created successfully!',
        feature
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.getFeature = (req, res) => {
  const id = req.query.id

  if (id) {
    // if id is present, get the feature with the given id
    Feature.findOne({
      where: {
        id
      }
    })
      .then(feature => {
        res.status(200).send({
          message: 'Feature was retrieved successfully!',
          feature
        })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  } else {
    // if id is not present, get all features
    Feature.findAll()
      .then(features => {
        if (features.length <= 0) {
          res.status(200).send({
            message: 'No features found!',
            features
          })
        }
        res.status(200).send({
          message: 'Features were retrieved successfully!',
          features
        })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  }
}

exports.updateFeature = (req, res) => {
  const id = req.query.id

  if (id) {
    // if id is present, update the feature with the given id
    Feature.findOne({
      where: {
        id
      }
    })
      .then(feature => {
        if (!feature) {
          return res.status(404).send({ message: 'Feature Not found.' })
        }
        feature.update({
          name: req.body.name
        })
          .then(feature => {
            res.status(200).send({
              message: 'Feature was updated successfully!',
              feature
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
    // if id is not present, return an error
    res.status(400).send({ message: 'Feature id is required!' })
  }
}

exports.deleteFeature = (req, res) => {
  const id = req.query.id

  if (id) {
    // if id is present, delete the feature with the given id
    Feature.findOne({
      where: {
        id
      }
    })
      .then(feature => {
        if (!feature) {
          return res.status(404).send({ message: 'Feature Not found.' })
        }
        feature.destroy()
          .then(() => {
            res.status(200).send({
              message: 'Feature was deleted successfully!'
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
    // if id is not present, return an error
    res.status(400).send({ message: 'Feature id is required!' })
  }
}
