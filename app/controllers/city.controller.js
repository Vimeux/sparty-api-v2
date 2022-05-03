const db = require('../models')
const City = db.city

exports.createCity = (req, res) => {
  // Save City to data base
  City.create({
    name: req.body.name
  })
    .then(city => {
      res.status(200).send({
        message: 'City was created successfully!',
        city
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.getCity = (req, res) => {
  const id = req.query.id
  if (id) {
    // if id is present, get the city with the given id
    City.findOne({
      where: {
        id
      }
    })
      .then(city => {
        res.status(200).send({
          message: 'City was retrieved successfully!',
          city
        })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  } else {
    // if id is not present, get all cities
    City.findAll()
      .then(cities => {
        if (cities.length <= 0) {
          res.status(200).send({
            message: 'No cities found!',
            cities
          })
        }
        res.status(200).send({
          message: 'Cities were retrieved successfully!',
          cities
        })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  }
}

exports.updateCity = (req, res) => {
  const id = req.query.id
  if (id) {
    // if id is present, update the city with the given id
    City.findOne({
      where: {
        id
      }
    })
      .then(city => {
        if (city) {
          city.update({
            name: req.body.name
          })
            .then(city => {
              res.status(200).send({
                message: 'City was updated successfully!',
                city
              })
            })
            .catch(err => {
              res.status(500).send({ message: err.message })
            })
        } else {
          res.status(404).send({
            message: 'City not found!'
          })
        }
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  } else {
    // if id is not present, return error
    res.status(400).send({
      message: 'Id is required!'
    })
  }
}

exports.deleteCity = (req, res) => {
  const id = req.query.id
  if (id) {
    // if id is present, delete the city with the given id
    City.findOne({
      where: {
        id
      }
    })
      .then(city => {
        if (city) {
          city.destroy()
            .then(city => {
              res.status(200).send({
                message: 'City was deleted successfully!'
              })
            })
            .catch(err => {
              res.status(500).send({ message: err.message })
            })
        } else {
          res.status(404).send({
            message: 'City not found!'
          })
        }
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  } else {
    // if id is not present, return error
    res.status(400).send({
      message: 'Id is required!'
    })
  }
}
