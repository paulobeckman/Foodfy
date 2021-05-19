const express = require('express')
const routes = express.Router()
const multer = require('../../app/middlewares/multer')

const Chefs = require('../../app/controllers/admin/ChefsController')

const { onlyUsers, isAdminUserRedirectToChefs } = require('../../app/middlewares/session')

//CHEFS
routes.get('/chefs', onlyUsers, Chefs.index)
routes.get('/chefs/create', onlyUsers, isAdminUserRedirectToChefs, Chefs.create)
routes.get('/chefs/:id', onlyUsers, Chefs.show)
routes.get('/chefs/:id/edit', onlyUsers, isAdminUserRedirectToChefs, Chefs.edit)

routes.post('/chefs', onlyUsers, isAdminUserRedirectToChefs, multer.array("photos", 1), Chefs.post)
routes.put('/chefs', onlyUsers, isAdminUserRedirectToChefs, multer.array("photos", 1), Chefs.update)
routes.delete('/chefs', onlyUsers, isAdminUserRedirectToChefs, Chefs.delete)

module.exports = routes