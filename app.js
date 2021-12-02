/* ===== Dependencies ===== */

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const userRouter = require('./routers/userRouter')
const apiRouter = require('./routers/apiRouter')
const constants = require('./constants')

/* ===== Constants ===== */

const PORT = 8080

const accessTokenSecret = 'blah'
const refreshTokenSecret = 'blahblah'

// Passwords cannot be stored as plain-text - only as hash+salt(10!)
const { USERS, INFORMATION, REFRESHTOKENS } = constants

app.use(morgan('tiny'))
app.use(express.json())

app.use('/users', userRouter.router)

app.use('/api', apiRouter)

app.options('/', (req, res) => {
  if (!req.headers.authorization) {
    res.setHeader('Allow', 'OPTIONS, GET, POST')
    res.status(200).send([
      {
        method: 'post',
        path: '/users/register',
        description: 'Register, Required: email, name, password',
        example: {
          body: {
            email: 'user@email.com',
            name: 'user',
            password: 'password',
          },
        },
      },
      {
        method: 'post',
        path: '/users/login',
        description: 'Login, Required: valid email and password',
        example: { body: { email: 'user@email.com', password: 'password' } },
      },
    ])
    return
  }

  const token = req.headers.authorization.split(' ')[1]

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) {
      console.log('we found out it was err')
      res.setHeader('Allow', 'OPTIONS, GET, POST')
      res.status(200).send([
        {
          method: 'post',
          path: '/users/register',
          description: 'Register, Required: email, name, password',
          example: {
            body: {
              email: 'user@email.com',
              name: 'user',
              password: 'password',
            },
          },
        },
        {
          method: 'post',
          path: '/users/login',
          description: 'Login, Required: valid email and password',
          example: { body: { email: 'user@email.com', password: 'password' } },
        },
        {
          method: 'post',
          path: '/users/token',
          description: 'Renew access token, Required: valid refresh token',
          example: { headers: { token: '*Refresh Token*' } },
        },
      ])
      return
    }

    if (!decoded.isAdmin) {
      console.log('we found out it was not admin')
      res.setHeader('Allow', 'OPTIONS, GET, POST')
      res.status(200).send([
        {
          method: 'post',
          path: '/users/register',
          description: 'Register, Required: email, name, password',
          example: {
            body: {
              email: 'user@email.com',
              name: 'user',
              password: 'password',
            },
          },
        },
        {
          method: 'post',
          path: '/users/login',
          description: 'Login, Required: valid email and password',
          example: { body: { email: 'user@email.com', password: 'password' } },
        },
        {
          method: 'post',
          path: '/users/token',
          description: 'Renew access token, Required: valid refresh token',
          example: { headers: { token: '*Refresh Token*' } },
        },
        {
          method: 'post',
          path: '/users/tokenValidate',
          description: 'Access Token Validation, Required: valid access token',
          example: { headers: { Authorization: 'Bearer *Access Token*' } },
        },
        {
          method: 'get',
          path: '/api/v1/information',
          description:
            "Access user's information, Required: valid access token",
          example: { headers: { Authorization: 'Bearer *Access Token*' } },
        },
        {
          method: 'post',
          path: '/users/logout',
          description: 'Logout, Required: access token',
          example: { body: { token: '*Refresh Token*' } },
        },
      ])
      return
    }

    res.setHeader('Allow', 'OPTIONS, GET, POST')
    console.log('we found out it was admin')
    res.status(200).send([
      {
        method: 'post',
        path: '/users/register',
        description: 'Register, Required: email, name, password',
        example: {
          body: {
            email: 'user@email.com',
            name: 'user',
            password: 'password',
          },
        },
      },
      {
        method: 'post',
        path: '/users/login',
        description: 'Login, Required: valid email and password',
        example: { body: { email: 'user@email.com', password: 'password' } },
      },
      {
        method: 'post',
        path: '/users/token',
        description: 'Renew access token, Required: valid refresh token',
        example: { headers: { token: '*Refresh Token*' } },
      },
      {
        method: 'post',
        path: '/users/tokenValidate',
        description: 'Access Token Validation, Required: valid access token',
        example: { headers: { Authorization: 'Bearer *Access Token*' } },
      },
      {
        method: 'get',
        path: '/api/v1/information',
        description: "Access user's information, Required: valid access token",
        example: { headers: { Authorization: 'Bearer *Access Token*' } },
      },
      {
        method: 'post',
        path: '/users/logout',
        description: 'Logout, Required: access token',
        example: { body: { token: '*Refresh Token*' } },
      },
      {
        method: 'get',
        path: 'api/v1/users',
        description: 'Get users DB, Required: Valid access token of admin user',
        example: { headers: { Authorization: 'Bearer *Access Token*' } },
      },
    ])
  })
})

/* ===== ============ ===== */

module.exports = app
