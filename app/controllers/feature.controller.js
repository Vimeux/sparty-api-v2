const db = require('../models')
const Feature = db.feature

exports.createFeature = async (req, res) => {
  // Save Place to data base
  const { name } = req.body

  if (!name) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    const feature = await Feature.create({
      name
    })

    res.status(201).send({
      message: 'Feature was created successfully!',
      feature
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.getFeature = async (req, res) => {
  const id = req.query.id

  try {
    if (id) {
      const feature = await Feature.findOne({
        where: {
          id
        }
      })

      res.status(200).send({
        message: 'Feature was found successfully!',
        feature
      })
    } else {
      const features = await Feature.findAll()

      res.status(200).send({
        message: 'Features were found successfully!',
        features
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.updateFeature = async (req, res) => {
  const id = req.query.id
  const { name } = req.body

  if (!id) return res.status(400).send({ message: 'Please provide a feature id.' })

  try {
    const feature = await Feature.findOne({
      where: {
        id
      }
    })

    if (!feature) return res.status(404).send({ message: 'Feature Not found.' })

    const updatedFeature = await feature.update({
      name
    })

    res.status(200).send({
      message: 'Feature was updated successfully!',
      updatedFeature
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.deleteFeature = async (req, res) => {
  const id = req.query.id

  if (!id) return res.status(400).send({ message: 'Please provide a feature id.' })

  try {
    const feature = await Feature.findOne({
      where: {
        id
      }
    })

    if (!feature) return res.status(404).send({ message: 'Feature Not found.' })

    await feature.destroy()

    res.status(200).send({
      message: 'Feature was deleted successfully!'
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
