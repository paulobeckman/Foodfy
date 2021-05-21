const User = require('../../models/User')
const Chef = require('../../models/Chef')
const Recipe = require('../../models/Recipes')
const File = require('../../models/File')
const Recipe_File = require('../../models/Recipe_Files')

module.exports = {
    async index(req, res){
        try{
            let results = await Recipe.findByUser(req.session.userId)
            const recipes = results.rows
            
            const promisseRecipeFile = recipes.map(async recipe => {
                const filesResults = await Recipe_File.find(recipe.id)
                const file = filesResults.rows[0].path

                return {
                    ...recipe,
                    src: `${req.protocol}://${req.headers.host}${file.replace("public", "")}`
                }
            })

            const recipeFile = await Promise.all(promisseRecipeFile)
            
            return res.render("admin/recipes/index", {recipes: recipeFile})

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
            let results = await Recipe.create({...req.body, user_id: req.session.userId})
            const recipeId = results.rows[0].id

            const filesPromise = req.files.map(file => File.create(file))
            const fileResults = await Promise.all(filesPromise)
            
            const filesPromiseResults = fileResults.map(file => {
                const fileId = file.rows[0].id

                Recipe_File.create({recipe_id: recipeId, file_id: fileId})
            })

            await Promise.all(filesPromiseResults)

            const recipeTitle = req.body.title

            return await res.render("admin/recipes/alert/success", {recipeTitle})
        
        } catch (error) {
            console.error(error)
            return res.render('admin/recipes/alert/error')
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

            results = await User.find(req.session.userId)
            const loggedUser = results.rows[0]  

            return res.render("admin/recipes/show", {recipe: RecipeFiles, loggedUser})
            
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


            results = await User.find(req.session.userId)
            const loggedUser = results.rows[0].is_admin
            const loggedUserId = results.rows[0].id

            return res.render("admin/recipes/edit", {recipe, files, chefs, loggedUser, loggedUserId})

        } catch (error) {
            console.error(error)
        }
    },
    async update(req, res){
        try {
            if(req.files.length != 0){
                const filesPromise = req.files.map(file => File.create(file)) 
                const fileResults = await Promise.all(filesPromise)
                const filesPromiseResults = fileResults.map(file => {
                    const  file_id = file.rows[0].id
        
                    Recipe_File.create({recipe_id: req.body.id, file_id})
                })

                await Promise.all(filesPromiseResults)
            }

            await Recipe.update(req.body)

            if (req.body.removed_files){
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                removedFiles.map(id => Recipe_File.deleteByFile(id))             
                const removedFilesPromise = await removedFiles.map(id => File.delete(id))
                
                await Promise.all(removedFilesPromise)
            }

            return await res.redirect(`recipes/${req.body.id}`)

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
            
            return res.render("admin/recipes/alert/delete-success")
            
        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/alert/delete-error')
        }
    }
}