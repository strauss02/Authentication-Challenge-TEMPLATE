exports.INFORMATION = []

exports.REFRESHTOKENS = []

exports.USERS = [
  {
    email: 'admin@email.com',
    name: 'admin',
    password: '$2b$10$tgqItOt6gzm9zJ3b1nd5vOarzktWlBYgorHeaIlcdVvmJM5UFI2km',
    isAdmin: true,
  },
]

exports.PORT = 8080

exports.accessTokenSecret = 'blah'
exports.refreshTokenSecret = 'blahblah'

exports.generateAccessToken = function (user) {
  const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: '10s' })
  return accessToken
}

exports.generateRefreshToken = function (user) {
  const refreshToken = jwt.sign(user, refreshTokenSecret)
  REFRESHTOKENS.push(refreshToken)
  return refreshToken
}

exports.checkAdmin = function checkAdmin(email, name, password) {
  return (
    email === 'admin@email.com' && name === 'admin' && password === 'Rc123456!'
  )
}
