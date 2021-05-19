const express = require('express')
const routes = express.Router()

const recipes = require('./recipes')
const chefs = require('./chefs')
const login = require('./login')
const users = require('./users')

routes.use(
    recipes, 
    chefs,
    login,
    users
)

module.exports = routes