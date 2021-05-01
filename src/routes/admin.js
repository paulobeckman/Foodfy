const express = require('express')
const routes = express.Router()

const Recipes = require('../app/controllers/RecipesAdminController')
const Chefs = require('../app/controllers/ChefsAdminController')

routes.get('/recipes', Recipes.index)
routes.get('/Chefs', Chefs.index)

module.exports = routes