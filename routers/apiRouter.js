const express = require('express')
const router = express.Router()
const userRouter = require('./userRouter')
const constants = require('./../constants')
const jwt = require('jsonwebtoken')

const { INFORMATION, accessTokenSecret } = constants

router.get('/v1/information', (req, res) => {
  const authHeader = req.headers.Authorization
  const token = req.headers.Authorization.split(' ')[1]
  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (decoded) {
        console.log('AJJJJJJJJJJ', INFORMATION)
        const selectedUser = INFORMATION.find(
          (userInfo) => userInfo.email === decoded.email
        )
        res.send({ email: selectedUser.email, info: selectedUser.info })
      } else {
        res.status(403).send('Invalid Access Token')
      }
    })
  } else {
    res.status(401).send('Access Token Required')
  }
})

router.get('/v1/users', (req, res) => {
  const token = req.headers.Authorization.split(' ')[1]
  if (!token) {
    res.status(401).send('Access Token required')
    return
  }
  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (decoded) {
      decoded.isAdmin
        ? res.send({ USERS })
        : res.status(403).send('Invalid Access Token')
    } else {
      res.status(403).send('Invalid Access Token')
    }
  })
})

module.exports = router
