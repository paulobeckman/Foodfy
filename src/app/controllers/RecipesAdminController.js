const Chef = require('../models/Chef')
const Recipe = require('../models/Recipes')
const File = require('../models/File')
const Recipe_File = require('../models/Recipe_Files')

module.exports = {
    async index(req, res){
        let results = await Recipe.all()
        const recipes = results.rows

        // results = await Recipe_File.find()
        // const files = results.rows.map(file =>({
        //     ...file,
        //     src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        // }))

        return res.render("admin/recipes/index", {recipes})
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
    async show(req, res){
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        results = await Recipe_File.find(req.params.id)
        let files = await results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        const RecipeFiles = {
            ...recipe,
            files
        }

        return res.render("admin/recipes/show", {recipe: RecipeFiles})
    },
}