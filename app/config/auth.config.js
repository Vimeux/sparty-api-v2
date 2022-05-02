require('dotenv').config() // sert pour récupérer les données d'un fichier .env

module.exports = {
  secret: process.env.JWT_SECRET
}
