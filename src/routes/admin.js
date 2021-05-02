const express = require('express')
const routes = express.Router()

const Recipes = require('../app/controllers/RecipesAdminController')
const Chefs = require('../app/controllers/ChefsAdminController')

routes.get('/recipes', Recipes.index)
routes.get('/recipes/create', Recipes.create)

routes.get('/chefs', Chefs.index)
routes.get('/chefs/create', Chefs.create)

module.exports = routes