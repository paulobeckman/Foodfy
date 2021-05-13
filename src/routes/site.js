const express = require('express')
const routes = express.Router()

const Home = require('../app/controllers/site/HomeController')
const Recipes = require('../app/controllers/site/RecipesController')
const Chefs = require('../app/controllers/site/ChefsController')

routes.get('/', Home.index)
routes.get('/about', function(req, res){
    return res.render("site/about/index")
})
routes.get('/recipes', Recipes.index)
routes.get('/chefs', Chefs.index)

module.exports = routes