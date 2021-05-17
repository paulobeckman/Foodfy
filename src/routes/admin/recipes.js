const express = require('express')
const routes = express.Router()
const multer = require('../../app/middlewares/multer')

const Recipes = require('../../app/controllers/admin/RecipesController')

const { onlyUsers } = require('../../app/middlewares/session')

//RECIPES
routes.get('/recipes', onlyUsers, Recipes.index)
routes.get('/recipes/create', onlyUsers, Recipes.create)
routes.get('/recipes/:id', onlyUsers, Recipes.show)
routes.get('/recipes/:id/edit', onlyUsers, Recipes.edit)

routes.post('/recipes', onlyUsers, multer.array("photos", 5), Recipes.post)
routes.put('/recipes', onlyUsers, multer.array("photos", 5), Recipes.update)
routes.delete('/recipes', onlyUsers, Recipes.delete)


module.exports = routes