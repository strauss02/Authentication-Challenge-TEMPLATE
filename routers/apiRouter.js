const express = require('express')
const router = express.Router()
const userRouter = require('./userRouter')
const constants = require('./../constants')
const jwt = require('jsonwebtoken')

const { USERS, INFORMATION, accessTokenSecret } = constants

router.get('/v1/information', (req, res) => {
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  if (token) {
    console.log('AJJJJJJJJJJ', token)
    console.log('MMMMMMMMMMMMMMMMMMMMM', accessTokenSecret)
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (decoded) {
        console.log('ALLLLLLLLLL', INFORMATION)
        const selectedUser = USERS.find(
          (userInfo) => userInfo.email === decoded.email
        )
        return res
          .status(200)
          .send([{ email: selectedUser.email, info: selectedUser.info }])
      } else {
        console.log('GGGGGGGGGGGGGGGGGGGGG', decoded)
        return res.status(403).send('Invalid Access Token')
      }
    })
  } else {
    return res.status(401).send('Access Token Required')
  }
})

// router.get('/v1/information', (req, res) => {
//   const token = req.headers.authorization.split(' ')[1]

//   if (!token) {
//     res.status(401).send('Access Token Required')
//     return
//   }

//   jwt.verify(token, accessTokenSecret, (error, user) => {
//     if (error) {
//       res.status(403).send('Invalid Access Token')
//       return
//     }
//     const userInfo = INFORMATION.find((obj) => {
//       return user.email === obj.email
//     })
//     res.send([{ email: userInfo.email, info: userInfo.info }])
//     return
//   })
// })

router.get('/v1/users', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    res.status(401).send('Access Token required')
    return
  }
  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (decoded) {
      decoded.isAdmin
        ? res.send(USERS)
        : res.status(403).send('Invalid Access Token')
    } else {
      res.status(403).send('Invalid Access Token')
    }
  })
})

module.exports = router
