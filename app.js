/* write your server code here */
/* ===== Dependencies ===== */
const express = require('express')
const app = express()
const Router = express.Router()
const bcrypt = require('bcrypt')
const { json } = require('express')
const morgan = require('morgan')
/* ===== Constants ===== */
const PORT = 8080
// Passwords cannot be stored as plain-text - only as hash+salt(10!)
const USERS = [
  {
    email: 'admin@email.com',
    name: 'admin',
    password: '$2b$10$tgqItOt6gzm9zJ3b1nd5vOarzktWlBYgorHeaIlcdVvmJM5UFI2km',
    isAdmin: true,
  },
]
const INFORMATION = []
const REFRESHTOKENS = []
// {hashedPassword : salt}
const HASHES = {
  $2b$10$tgqItOt6gzm9zJ3b1nd5vOarzktWlBYgorHeaIlcdVvmJM5UFI2km:
    '$2b$10$tgqItOt6gzm9zJ3b1nd5vO',
}
/* ===== Hash Function =====*/

async function generatePasswordHash(password) {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  HASHES[hashedPassword] = salt
  return hashedPassword
}

/* ===== ============ ===== */

app.use(morgan('tiny'))
app.use(express.json)

app.post('/users/register', (req, res) => {
  if (INFORMATION[req.body.email]) {
    res.status(409).send('user already exists')
    res.end()
    return
  }
  INFORMATION.email = [req.body.email]
  INFORMATION.info = `${req.body.user} info`
  res.status(201).send('Register Success')
  res.end()
})

app.post('/users/login', (req, res) => {})

module.exports = app
