const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const Recipes = require('../app/controllers/RecipesAdminController')
const Chefs = require('../app/controllers/ChefsAdminController')

routes.get('/recipes', Recipes.index)
routes.get('/recipes/create', Recipes.create)

routes.get('/chefs', Chefs.index)
routes.get('/chefs/create', Chefs.create)

routes.post('/chefs', multer.array("photos", 1),Chefs.post)

module.exports = routes