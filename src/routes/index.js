const express = require('express')
const routes = express.Router()

const public = require('./public')
const admin = require('./admin')

routes.use('/', public)
routes.use('/admin', admin)

module.exports = routes