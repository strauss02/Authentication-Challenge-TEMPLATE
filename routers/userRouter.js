const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const constants = require('./../constants')
/* ===== Constants ===== */

const {
  PORT,
  accessTokenSecret,
  refreshTokenSecret,
  USERS,
  INFORMATION,
  REFRESHTOKENS,
} = constants

router.post('/register', async (req, res) => {
  const { email, name, password } = req.body

  if (INFORMATION.some((userInfo) => userInfo.email === req.body.email)) {
    res.status(409).send('user already exists')
    res.end()
    return
  }

  const admin = constants.checkAdmin(email, name, password)

  const newUser = {
    email: req.body.email,
    name: req.body.name,
    password: await bcrypt.hash(req.body.password, 10),
    isAdmin: admin,
  }

  USERS.push(newUser)

  INFORMATION.push({ email: req.body.email, info: `${name} info` })

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
    Authorization: 'Bearer '
  }
})

router.post('/tokenValidate', (req, res) => {
  const token = req.headers.Authorization.split(' ')[1]
  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      console.log(err)
      decoded
        ? res.send({ valid: true })
        : res.status(403).send('Invalid Access Token')
    })
  } else {
    res.status(401).send('Access Token Required')
  }
})

router.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken) {
    jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
      if (decoded) {
        accessToken = generateAccessToken(decoded)
        res.send({ accessToken })
      } else {
        res.status(403).send('Invalid Refresh Token')
      }
    })
  } else {
    res.status(401).send('Refresh Token Required')
  }
})

router.post('/logout', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken) {
    jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
      if (decoded) {
        res.send('User Logged Out Successfully')
      } else {
        res.status(403).send('Invalid Refresh Token')
      }
    })
  } else {
    res.status(401).send('Refresh Token Required')
  }
})

/* ===== Utility Functions ===== */

function generateAccessToken(user) {
  const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: '10s' })
  return accessToken
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, refreshTokenSecret)
  REFRESHTOKENS.push(refreshToken)
  return refreshToken
}

module.exports = { router }
