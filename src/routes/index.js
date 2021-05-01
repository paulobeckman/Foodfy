const express = require('express')
const routes = express.Router()

const site = require('./site')
const admin = require('./admin')

routes.use('/', site)
routes.use('/admin', admin)

module.exports = routes