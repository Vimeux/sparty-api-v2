const db = require('../models')
const party = db.party

const checkPartyExisted = (req, res, next) => {
  const { invitationCode } = req.body

  if (!invitationCode) return res.status(400).send({ message: 'Please fill all the required fields.' })

  party.findOne({
    where: {
      invitationCode
    }
  }).then(party => {
    if (party) return res.status(400).send({ message: 'Invitation code is not valid.' })
    next()
  }
  ).catch(err => {
    res.status(500).send({ message: err.message })
  }
  )
}

module.exports = {
  checkPartyExisted
}
