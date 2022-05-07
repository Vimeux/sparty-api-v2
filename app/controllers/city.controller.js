const db = require('../models')
const City = db.city

exports.createCity = async (req, res) => {
  // Save City to data base
  const { name } = req.body

  if (!name) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    const city = await City.create({
      name
    })

    res.status(201).send({
      message: 'City was created successfully!',
      city
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.getCity = async (req, res) => {
  const id = req.query.id

  try {
    if (id) {
      const city = await City.findOne({
        where: {
          id
        }
      })

      res.status(200).send({
        message: 'City was found successfully!',
        city
      })
    } else {
      const cities = await City.findAll()

      res.status(200).send({
        message: 'Cities were found successfully!',
        cities
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.updateCity = async (req, res) => {
  const id = req.query.id
  const { name } = req.body

  if (!id) return res.status(400).send({ message: 'Please provide a city id.' })
  if (!name) return res.status(400).send({ message: 'Please provide a city name.' })

  try {
    const city = await City.findOne({
      where: {
        id
      }
    })
    if (!city) return res.status(404).send({ message: 'City not found.' })

    const updatedCity = await city.update({
      name
    })

    res.status(200).send({
      message: 'City was updated successfully!',
      updatedCity
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.deleteCity = async (req, res) => {
  const id = req.query.id

  if (!id) return res.status(400).send({ message: 'Please provide a city id.' })

  try {
    const city = await City.findOne({
      where: {
        id
      }
    })
    if (!city) return res.status(404).send({ message: 'City not found.' })

    await city.destroy()

    res.status(200).send({
      message: 'City was deleted successfully!'
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
