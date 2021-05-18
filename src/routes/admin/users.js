const express = require('express')
const routes = express.Router()

const UserController = require('../../app/controllers/user/UserController')
const ProfileController = require('../../app/controllers/user/ProfileController')

const { onlyUsers, isAdminUserRedirectToUsers } = require('../../app/middlewares/session')

// Rotas de perfil de um usuário logado
routes.get('/profile', onlyUsers, ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/profile', onlyUsers, ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', onlyUsers,  UserController.list) // Mostrar a lista de usuários cadastrados
routes.post('/users', onlyUsers, isAdminUserRedirectToUsers, UserController.post) // Cadastrar um usuário
routes.get('/users/create', onlyUsers, isAdminUserRedirectToUsers, UserController.create) // Mostrar o formulário de criação de um usuário
// routes.put('/users/:id', onlyUsers, isAdminUserRedirectToUsers, UserController.put) // Editar um usuário
routes.get('/users/:id/edit', onlyUsers, isAdminUserRedirectToUsers, UserController.edit) // Mostrar o formulário de edição de um usuário
// routes.delete('/users/:id', onlyUsers, isAdminUserRedirectToUsers, UserController.delete) // Deletar um usuário

module.exports = routes