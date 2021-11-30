/* ===== Dependencies ===== */
const express = require('express');
const app = express()
const Router = express.Router()
/* ===== Constants ===== */
// Passwords cannot be stored as plain-text - only as hash+salt(10!)
const PORT = 8080
const USERS = [{ email: "admin@email.com",
                  name: "admin",
  password: "**hashed password**",
   isAdmin: true }.
]
const INFORMATION = []
const REFRESHTOKENS = []
/* ===== ============ ===== */


app.get('/', (req,res)=> {
  res.send('hello world')
})

app.listen(PORT, ()=> console.log(`Listening on ${PORT}`))