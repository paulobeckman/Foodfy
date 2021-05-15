const express = require('express')
const routes = express.Router()

const site = require('./site')
const admin = require('./admin')
const users = require('./users')

routes.use('/', site)
routes.use('/admin', admin)
routes.use('/users', users)

module.exports = routes