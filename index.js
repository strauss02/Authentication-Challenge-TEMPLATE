const express = require('express')
const app = require('./app.js')
const morgan = require('morgan')
const PORT = 8080

app.use(morgan('tiny'))

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
