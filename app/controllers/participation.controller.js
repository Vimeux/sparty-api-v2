const { extractIdFromRequestAuthHeader } = require('../helpers/tokenHelper')
const db = require('../models')
const Party = db.party
const User = db.user

/**
 * participate in a party
 * @param {*} req invitaitonCode, budgetParticipation
 * @param {*} res addedUsers
 * @returns {object} addedUsers
 */
exports.participate = async (req, res) => {
  const userId = extractIdFromRequestAuthHeader(req)
  const { invitationCode, budgetParticipation } = req.body

  if (!invitationCode || !budgetParticipation) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    const party = await Party.findOne({
      where: {
        invitationCode
      }
    })
    if (!party) return res.status(400).send({ message: 'Invitation code is not valid.' })

    const user = await User.findOne({
      where: {
        id: userId
      }
    })
    if (!user) return res.status(400).send({ message: 'User does not exist.' })

    const addedUsers = await party.addUsers(user, { through: { budgetParticiaption: budgetParticipation } })

    return res.status(200).send({
      message: 'User was updated successfully!',
      addedUsers
    })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

/**
 * get all users who participate in a party
 * @param {*} req invitaitonCode
 * @param {*} res users
 * @returns {object} users
 */
exports.getParticipants = async (req, res) => {
  const { invitationCode } = req.body

  if (!invitationCode) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    const party = await Party.findOne({
      where: {
        invitationCode
      }
    })
    if (!party) return res.status(400).send({ message: 'Invitation code is not valid.' })

    const users = await party.getUsers()
    return res.status(200).send({ users })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

/**
 * update a user's participation in a party
 * @param {*} req invitaitonCode, budgetParticipation
 * @param {*} res userUpdated
 * @returns {object} userUpdated
 */
exports.updateParticipant = async (req, res) => {
  const userId = extractIdFromRequestAuthHeader(req)
  const { invitationCode, budgetParticipation } = req.body

  if (!invitationCode || !budgetParticipation) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    const party = await Party.findOne({
      where: {
        invitationCode
      }
    })
    if (!party) return res.status(400).send({ message: 'Invitation code is not valid.' })

    const user = await User.findOne({
      where: {
        id: userId
      }
    })
    if (!user) return res.status(400).send({ message: 'User does not exist.' })

    const userUpdated = await party.setUsers(user, { through: { budgetParticiaption: budgetParticipation } })
    console.log(userUpdated)

    return res.status(200).send({
      message: 'User was updated successfully!',
      userUpdated
    })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

/**
 * delete a user from a party
 * @param {*} req invitaitonCode
 * @param {*} res userDeleted
 * @returns {object} userDeleted
 */
exports.deleteParticipant = async (req, res) => {
  const userId = extractIdFromRequestAuthHeader(req)
  const { invitationCode } = req.body

  if (!invitationCode) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    const party = await Party.findOne({
      where: {
        invitationCode
      }
    })
    if (!party) return res.status(400).send({ message: 'Invitation code is not valid.' })

    const user = await User.findOne({
      where: {
        id: userId
      }
    })
    if (!user) return res.status(400).send({ message: 'User does not exist.' })

    const userDeleted = await party.removeUsers(user)

    return res.status(200).send({
      message: 'User was deleted successfully!',
      userDeleted
    })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}
