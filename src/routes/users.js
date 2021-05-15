const express = require('express')
const routes = express.Router()

const SessionController = require('./../app/controllers/user/SessionController')

// login/logout
routes.get('/login', SessionController.loginForm)

// reset password/forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)


module.exports = routes