/* ===== Dependencies ===== */

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const userRouter = require('./routers/userRouter')

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

app.use(morgan('tiny'))
app.use(express.json())

app.use('/users/', userRouter)
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

/* ===== ============ ===== */

module.exports = app
