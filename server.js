require('dotenv').config() // sert pour récupérer les données d'un fichier .env

const express = require('express')
const cors = require('cors')

const app = express()
const db = require('./app/models')
const Role = db.role

// autorise les requetes depuis le front react(access control allow origin)
app.use(cors())

// Initialisation de Express pour utiliser le body des requêtes au format UrlEncoded et JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // analyse les données entrante dans l'api, voir la doc express

// db.sequelize.sync({ force: true }).then(() => { // force: true permet de supprimer les tables existantes et de les recréer (juste pour le développement)
//   console.log('Drop and Resync Db') // en prod, juste sync sans parametre
//   initial()
// })

db.sequelize.sync({ alter: true }).then(() => {
  initial()
})

const initial = () => {
  Role.upsert({
    id: 1,
    name: 'user'
  })

  Role.upsert({
    id: 2,
    name: 'moderator'
  })

  Role.upsert({
    id: 3,
    name: 'admin'
  })
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to sparty application.' })
})

require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/place.routes')(app)
require('./app/routes/feature.routes')(app)
require('./app/routes/city.routes')(app)

// set port, listen for requests
const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
