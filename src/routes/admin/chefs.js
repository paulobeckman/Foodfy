const express = require('express')
const routes = express.Router()
const multer = require('../../app/middlewares/multer')

const Chefs = require('../../app/controllers/admin/ChefsController')

const { onlyUsers } = require('../../app/middlewares/session')

//CHEFS
routes.get('/chefs', onlyUsers, Chefs.index)
routes.get('/chefs/create', onlyUsers, Chefs.create)
routes.get('/chefs/:id', onlyUsers, Chefs.show)
routes.get('/chefs/:id/edit', onlyUsers, Chefs.edit)

routes.post('/chefs', onlyUsers, multer.array("photos", 1), Chefs.post)
routes.put('/chefs', onlyUsers, multer.array("photos", 1), Chefs.update)
routes.delete('/chefs', onlyUsers, Chefs.delete)

module.exports = routes