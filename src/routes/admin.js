const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const Recipes = require('../app/controllers/admin/RecipesController')
const Chefs = require('../app/controllers/admin/ChefsController')
const UserController = require('../app/controllers/user/UserController')

//RECIPES
routes.get('/recipes', Recipes.index)
routes.get('/recipes/create', Recipes.create)
routes.get('/recipes/:id', Recipes.show)
routes.get('/recipes/:id/edit', Recipes.edit)

routes.post('/recipes', multer.array("photos", 5), Recipes.post)
routes.put('/recipes', multer.array("photos", 5), Recipes.update)
routes.delete('/recipes', Recipes.delete)

//CHEFS
routes.get('/chefs', Chefs.index)
routes.get('/chefs/create', Chefs.create)
routes.get('/chefs/:id', Chefs.show)
routes.get('/chefs/:id/edit', Chefs.edit)

routes.post('/chefs', multer.array("photos", 1), Chefs.post)
routes.put('/chefs', multer.array("photos", 1), Chefs.update)
routes.delete('/chefs', Chefs.delete)


// Rotas de perfil de um usuário logado
// routes.get('/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/profile', ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', UserController.list) // Mostrar a lista de usuários cadastrados
// routes.post('/users', UserController.post) // Cadastrar um usuário
// routes.get('/users/create', UserController.create) // Mostrar o formulário de criação de um usuário
// routes.put('/users/:id', UserController.put) // Editar um usuário
// routes.get('/users/:id/edit', UserController.edit) // Mostrar o formulário de edição de um usuário
// routes.delete('/users/:id', UserController.delete) // Deletar um usuário

module.exports = routes