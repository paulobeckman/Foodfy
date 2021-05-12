const Chef = require('../models/Chef')
const Recipe = require('../models/Recipes')
const File = require('../models/File')
const Recipe_File = require('../models/Recipe_Files')

module.exports = {
    async index(req, res){
        try{
            let results = await Recipe.all()
            const recipes = results.rows

            return res.render("admin/recipes/index", {recipes})

        } catch (error) {
            console.error(error)
        }
    },
    async create(req, res){
        try{
            let results = await Chef.all()
            const chefs = results.rows

            return res.render("admin/recipes/create", {chefs})
        
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try{
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
        
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res){
        try{
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
        
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res){
        try{
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]

            results = await Recipe_File.find(req.params.id)
            let files = await results.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            results = await Chef.all()
            const chefs = results.rows

            return res.render("admin/recipes/edit", {recipe, files, chefs})

        } catch (error) {
            console.error(error)
        }
    },
    async update(req, res){
        try {
            const keys = Object.keys(req.body)

            for(key of keys){
                if(req.body[key] == "" && key != "removed_files"){
                    return res.send('Please, fill all fields!')
                }
            }

            if(req.files.length != 0){
                const filesPromise = req.files.map(file => File.create(file))
                const fileResults = await Promise.all(filesPromise)
                const filesPromiseResults = fileResults.map(file => {
                    const  file_id = file.rows[0].id
        
                    Recipe_File.update({recipe_id: req.body.id, file_id})
                })

                await Promise.all(filesPromiseResults)
            }

            await Recipe.update(req.body)

            if (req.body.removed_files){
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
                
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                
                await Promise.all(removedFilesPromise)
            }

            return res.redirect(`recipes/${req.body.id}`)

        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res){
        try{
            const resultsFileId = await Recipe_File.find(req.body.id)

            await Recipe_File.deleteByRecipe(req.body.id)
            
            const removedFilesPromise = await resultsFileId.rows.map(file => File.delete(file.id))
            await Promise.all(removedFilesPromise)

            await Recipe.delete(req.body.id)  
            
            return res.redirect("recipes")
            
        } catch (error) {
            console.error(error)
        }
    }
}