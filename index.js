/* ===== Dependencies ===== */
const express = require('express')
const app = express()
const Router = express.Router()
const bcrypt = require('bcrypt')
/* ===== Constants ===== */
const PORT = 8080
// Passwords cannot be stored as plain-text - only as hash+salt(10!)
const USERS = [
  {
    email: 'admin@email.com',
    name: 'admin',
    password: '**hashed password**',
    isAdmin: true,
  },
]
const INFORMATION = []
const REFRESHTOKENS = []
const HASHES = {}
/* ===== ============ ===== */

async function generatePasswordHash(password) {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  HASHES[hashedPassword] = salt
  console.log(hashedPassword)
  return hashedPassword
}

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
