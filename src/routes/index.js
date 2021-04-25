const express = require('express')
const routes = express.Router()

const Layout = require('../app/controllers/HomeController')

routes.get('/', Layout.index)

module.exports = routes