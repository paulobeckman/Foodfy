const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const Recipes = require('../app/controllers/RecipesAdminController')
const Chefs = require('../app/controllers/ChefsAdminController')

//RECIPES
routes.get('/recipes', Recipes.index)
routes.get('/recipes/create', Recipes.create)
routes.get('/recipes/:id', Recipes.show)
routes.get('/recipes/:id/edit', Recipes.edit)

routes.post('/recipes', multer.array("photos", 6), Recipes.post)
routes.put('/recipes', multer.array("photos", 6), Recipes.update)
routes.delete('/recipes', Recipes.delete)

//CHEFS
routes.get('/chefs', Chefs.index)
routes.get('/chefs/create', Chefs.create)
routes.get('/chefs/:id', Chefs.show)
routes.get('/chefs/:id/edit', Chefs.edit)

routes.post('/chefs', multer.array("photos", 1), Chefs.post)
routes.put('/chefs', multer.array("photos", 1), Chefs.update)
routes.delete('/chefs', Chefs.delete)

module.exports = routes