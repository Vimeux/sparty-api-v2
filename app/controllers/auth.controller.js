const db = require('../models')
const User = db.user
const Role = db.role
const Op = db.Sequelize.Op
const bcrypt = require('bcryptjs')
// librarie de gestion des tokens
const { generateToken } = require('../helpers/tokenHelper')
const { extractIdFromRequestAuthHeader } = require('../helpers/tokenHelper')

exports.signup = async (req, res) => {
  // Save User to Database
  const { email, password, firstName, lastName, phone, roles } = req.body

  if (!email || !password || !firstName || !lastName) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    const user = await User.create({
      email,
      password: bcrypt.hashSync(password, 8),
      firstName,
      lastName,
      phone
    })
    if (!user) return res.status(400).send({ message: 'User does not exist.' })

    if (roles) {
      const role = await Role.findAll({
        where: {
          name: {
            [Op.or]: roles
          }
        }
      })
      if (!role) return res.status(400).send({ message: 'Role does not exist.' })
      await user.setRoles(role)
    } else {
      await user.setRoles([1])
    }

    // génération du token
    generateToken({ id: user.id }, (error, token) => {
      if (error) return res.status(500).send('Error while genrating token')

      const authorities = []
      const userRoles = user.getRoles()
      for (let i = 0; i < userRoles.length; i++) {
        authorities.push('ROLE_' + userRoles[i].name.toUpperCase())
      }
      res.status(200).send({
        user,
        accessToken: token
      })
    })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

exports.signin = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (!user) return res.status(400).send({ message: 'User does not exist.' })

    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) return res.status(400).send({ message: 'Invalid password.' })

    // génération du token
    generateToken({ id: user.id }, (error, token) => {
      if (error) return res.status(500).send('Error while genrating token')

      const authorities = []
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push('ROLE_' + roles[i].name.toUpperCase())
        }
        res.status(200).send({
          user,
          accessToken: token
        })
      })
    })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

exports.getUser = async (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)

  try {
    const user = await User.findByPk(id)
    if (!user) return res.status(400).send({ message: 'User does not exist.' })

    res.send(user)
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

exports.deleteUser = async (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)

  try {
    const user = await User.findByPk(id)
    if (!user) return res.status(400).send({ message: 'User does not exist.' })

    await user.destroy()
    res.send({ message: 'User deleted.' })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }

  // delete user by id
  // User.destroy({
  //   where: {
  //     id
  //   }
  // })
  //   .then(user => {
  //     if (!user) {
  //       return res.status(404).send({ message: 'User Not found.' })
  //     } else {
  //       res.send({ message: 'User deleted successfully!' })
  //     }
  //   })
}
