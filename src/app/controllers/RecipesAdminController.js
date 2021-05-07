const Chef = require('../models/Chef')
const Recipe = require('../models/Recipes')

module.exports = {
    index(req, res){
        return res.render("admin/recipes/index")
    },
    async create(req, res){
        let results = await Chef.all()
        const chefs = results.rows

        return res.render("admin/recipes/create", {chefs})
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == ""){
                return res.send('Please, fill all fields!')
            }
        }

        if(req.files.length == 0){
            return res.send('Please, send at least one image')
        }
        
        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create(file))
        const fileResults = await Promise.all(filesPromise)
        
        const filesPromiseResults = fileResults.map(file => {
            const  fileId = file.rows[0].id

            Recipe_File.create({recipe_id: recipeId, file_id: fileId})
        })

        await Promise.all(filesPromiseResults)

        return res.redirect(`recipes/${recipeId}`)
    },
}