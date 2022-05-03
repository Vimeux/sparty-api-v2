const db = require('../models')
const User = db.user
const Role = db.role
const Op = db.Sequelize.Op
const bcrypt = require('bcryptjs')
// librarie de gestion des tokens
const { generateToken } = require('../helpers/tokenHelper')
const { extractIdFromRequestAuthHeader } = require('../helpers/tokenHelper')

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    phone: req.body.phone
  })
    .then(user => {
      if (req.body.roles) {
        // si l'utilisateur possède un rôle dans la requête
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles)
        })
      } else {
        // si l'utilisateur n'a pas de rôle dans la requête, on lui attribue le rôle user par défaut
        // user role = 1
        user.setRoles([1])
      }
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
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) return res.status(404).send({ message: 'User Not found.' })
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      )
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!'
        })
      }
      // génération du token
      generateToken({ id: user.id }, (error, token) => {
        if (error) return res.status(500).send('Error while genrating token')

        const authorities = []
        user.getRoles().then(roles => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push('ROLE_' + roles[i].name.toUpperCase())
          }
          res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
          })
        })
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.getUser = (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)

  User.findByPk(id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found.'
        })
      }
      res.status(200).send(user)
    })
}

exports.deleteUser = (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)

  // delete user by id
  User.destroy({
    where: {
      id
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      } else {
        res.send({ message: 'User deleted successfully!' })
      }
    })
}
