const User = require('../models/User')
const Recipe = require('../models/Recipes')

function onlyUsers(req, res, next){
    if(!req.session.userId){
        return res.send('Usuário não logado')
    }

    next()
}

function isLoggedRedirectToUsers(req, res, next){
    if(req.session.userId){
        return res.redirect('/admin/users')
    }

    next()
}

async function isAdminUserRedirectToUsers (req, res, next){
    let results = await User.find(req.session.userId)
    const is_admin = results.rows[0].is_admin

    if(is_admin === false){
        return res.redirect("/admin/users")
    }

    next()
}

async function isAdminUserRedirectToChefs (req, res, next){
    let results = await User.find(req.session.userId)
    const is_admin = results.rows[0].is_admin

    if(is_admin === false){
        return res.redirect("/admin/chefs")
    }

    next()
}

async function cannotDeleteYourProfile (req, res, next){
    let results = await User.find(req.session.userId)
    const user = results.rows[0]

    if(user){
        return res.redirect("/admin/users")
    }

    next()
}

async function authorizationToModifyRecipes (req, res, next){
    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]

    results = await User.find(req.session.userId)
    const is_admin = results.rows[0].is_admin

    if(is_admin !== true){
        if(recipe.user_id !== req.session.userId){
            return res.redirect("/admin/recipes")
        }
    }

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers,
    isAdminUserRedirectToUsers,
    isAdminUserRedirectToChefs,
    cannotDeleteYourProfile,
    authorizationToModifyRecipes
}