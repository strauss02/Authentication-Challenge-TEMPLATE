const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')

/* ===== Constants ===== */

const PORT = 8080

const accessTokenSecret = 'blah'
const refreshTokenSecret = 'blahblah'

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

router.post('/register', async (req, res) => {
  console.log(req.body.email)
  console.log(INFORMATION)

  if (INFORMATION.some((userInfo) => userInfo.email === req.body.email)) {
    res.status(409).send('user already exists')
    res.end()
    return
  }

  const newUser = {
    email: req.body.email,
    name: req.body.name,
    password: await bcrypt.hash(req.body.password, 10),
    isAdmin: false,
  }

  USERS.push(newUser)

  INFORMATION.push({ email: req.body.email, info: `${req.body.user} info` })

  res.status(201).send('Register Success')
  res.end()
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const selectedUser = USERS.find((user) => user.email === email)

  if (selectedUser) {
    console.log('AHHHHHHHHHHHHHHHH')
    console.log(selectedUser, password)

    bcrypt
      .compare(password, selectedUser.password)
      .then((result) => {
        if (result) {
          const accessToken = generateAccessToken(selectedUser)
          const refreshToken = generateRefreshToken(selectedUser)
          const response = {
            accessToken,
            refreshToken,
            email: selectedUser.email,
            name: selectedUser.name,
            isAdmin: selectedUser.isAdmin,
          }
          res.send(response)
        } else {
          res.status(403).send('User or Password incorrect')
        }
      })
      .catch((err) => {
        console.log(err)
        res.send('an error has occured')
      })
  } else {
    res.status(404).send('cannot find user')
  }
})

function generateAccessToken(user) {
  const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: '10s' })
  return accessToken
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, refreshTokenSecret)
  REFRESHTOKENS.push(refreshToken)
  return refreshToken
}

module.exports = router
