const Chef = require('../models/Chef')

async function checkAllFildsCreate (req, res, next){
    const keys = Object.keys(req.body)

    let results = await Chef.all()
    const chefs = results.rows

    for(key of keys){
        if(req.body[key] == ""){
            return res.render("admin/recipes/create", {
                recipe: req.body,
                chefs,
                error: "Por favor, preencha todos os campos"
            })
        }
    }

    if(!req.files || req.files.length == 0){
        return res.render("admin/recipes/create", {
            recipe: req.body,
            chefs,
            error: "Por favor, envie pelo menos uma imagem"
        })
    }

    next()
}

async function checkAllFildsUpdate(req, res, next){
    const keys = Object.keys(req.body)

    let results = await Chef.all()
    const chefs = results.rows

    for(key of keys){
        if(req.body[key] == "" && key != "removed_files"){
            return res.render("admin/recipes/create", {
                recipe: req.body,
                chefs,
                error: "Por favor, preencha todos os campos"
            })
        }
    }

    next()
}

module.exports = {
    checkAllFildsCreate,
    checkAllFildsUpdate
}