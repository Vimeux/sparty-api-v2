const { extractIdFromRequestAuthHeader } = require('../helpers/tokenHelper')
const db = require('../models')
const Party = db.party

exports.createParty = (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)
  const { budget, invitationCode, date, maxPersonn } = req.body

  if (!budget || !invitationCode || !date || !maxPersonn) return res.status(400).send({ message: 'Please fill all the required fields.' })

  // Save Party to data base
  Party.create({
    budget,
    invitationCode,
    date,
    maxPersonn,
    userId: id
  })
    .then(party => {
      res.status(200).send({
        message: 'Party was created successfully!',
        party
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.getParty = (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)

  if (id) {
    // if id is present, get the party with the given id
    if (req.query.id) {
      Party.findOne({
        where: {
          id: req.query.id
        }
      })
        .then(party => {
          // if place is not found
          if (!party) return res.status(404).send({ message: 'Party Not found.' })
          // if the place does not belong to the user
          if (party.userId !== id) return res.status(401).send({ message: 'Unauthorized.' })

          res.status(200).send({
            message: 'Party was retrieved successfully!',
            party
          })
        })
        .catch(err => {
          res.status(500).send({ message: err.message })
        })
    } else {
      // if id is not present, get all the parties of the user
      Party.findAll({
        where: {
          userId: id
        }
      })
        .then(parties => {
          // if no parties are found
          if (parties.length <= 0) return res.status(200).send({ message: 'No parties found!' })
          res.status(200).send({
            message: 'Parties were retrieved successfully!',
            parties
          })
        })
        .catch(err => {
          res.status(500).send({ message: err.message })
        })
    }
  }
}

exports.getAllParties = (req, res) => {
  Party.findAll()
    .then(parties => {
      if (parties.length <= 0) {
        res.status(200).send({
          message: 'No parties found!',
          parties
        })
      }
      res.status(200).send({
        message: 'Parties were retrieved successfully!',
        parties
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.updateParty = (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)
  const { budget, date, maxPersonn } = req.body
  // Save Party to data base
  Party.findOne({
    where: {
      id: req.query.id
    }
  })
    .then(party => {
      if (!party) return res.status(404).send({ message: 'Party Not found.' })
      if (party.userId !== id) return res.status(401).send({ message: 'Unauthorized.' })
      party.update({
        budget,
        date,
        maxPersonn
      })
        .then(party => {
          res.status(200).send({
            message: 'Party was updated successfully!',
            party
          })
        })
        .catch(err => {
          res.status(500).send({ message: err.message })
        })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.deleteParty = (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)
  // Save Party to data base
  Party.findOne({
    where: {
      id: req.query.id
    }
  })
    .then(party => {
      if (!party) return res.status(404).send({ message: 'Party Not found.' })
      if (party.userId !== id) return res.status(401).send({ message: 'Unauthorized.' })
      party.destroy()
        .then(() => {
          res.status(200).send({
            message: 'Party was deleted successfully!'
          })
        })
        .catch(err => {
          res.status(500).send({ message: err.message })
        })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
