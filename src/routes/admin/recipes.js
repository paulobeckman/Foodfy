const express = require('express')
const routes = express.Router()
const multer = require('../../app/middlewares/multer')

const { checkAllFildsCreate, checkAllFildsUpdate } = require('../../app/validators/recipe')

const Recipes = require('../../app/controllers/admin/RecipesController')

const { onlyUsers, authorizationToModifyRecipes } = require('../../app/middlewares/session')

//RECIPES
routes.get('/recipes', onlyUsers, Recipes.index)
routes.get('/recipes/create', onlyUsers, Recipes.create)
routes.get('/recipes/:id', onlyUsers, Recipes.show)
routes.get('/recipes/:id/edit', authorizationToModifyRecipes, onlyUsers, Recipes.edit)

routes.post('/recipes', onlyUsers, multer.array("photos", 5), checkAllFildsCreate, Recipes.post)
routes.put('/recipes', onlyUsers, authorizationToModifyRecipes, multer.array("photos", 5), checkAllFildsUpdate, Recipes.update)
routes.delete('/recipes', onlyUsers, authorizationToModifyRecipes, Recipes.delete)


module.exports = routes