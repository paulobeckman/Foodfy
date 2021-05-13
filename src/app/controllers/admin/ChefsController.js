const Chef = require('../../models/Chef')
const File = require('../../models/File')
const Recipe = require('../../models/Recipes')
const Recipe_File = require('../../models/Recipe_Files')

module.exports = {
    async index(req, res){
        try {
            let results = await Chef.all()
            const chefs = results.rows.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
            }))

            return res.render("admin/chefs/index", {chefs})
                    
        } catch (error) {
            console.error(error)
        }
    },
    create(req, res){
        return res.render("admin/chefs/create")
    },
    async post(req, res){
        try {
            const keys = Object.keys(req.body)
        
            for(key of keys) {
                if (req.body[key] == ""){
                    return res.send('Please, fill all fields!')
                }
            }
            
            if (req.files.length == 0){
                return res.send('Please, send at least one image')        
            }

            let results = await File.create(req.files[0])
            const file_id = results.rows[0].id
            
            results = await Chef.create({...req.body, file_id})
            const chefId = results.rows[0].id


            return res.redirect(`chefs/${chefId}/edit`)

        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res){
        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]
            
            ChefAddingSrc = {
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
            }

            results = await Recipe.findByChefs(req.params.id)
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

            return res.render("admin/chefs/show", {chef: ChefAddingSrc, recipes: recipeFile})

        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res){
        try{
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            if(!chef) return res.send("Chef not found!")
            
            //get image
            results = await Chef.files(chef.id)
            let files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("admin/chefs/edit", {chef, files})

        } catch (error) {
            console.error(error)
        }
    },
    async update(req, res){
        try {
            const keys = Object.keys(req.body)
        
            for(key of keys) {
                if (req.body[key] == "" && key != "removed_files"){
                    return res.send('Please, fill all fields!')
                }
            }


            if(req.files.length != 0){
                let results = await File.create(req.files[0])
                const file_id = results.rows[0].id

                await Chef.update({...req.body, file_id})
            }
                    
            if (req.body.removed_files){
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
                
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                
                await Promise.all(removedFilesPromise)
            }

            return res.redirect(`chefs/${req.body.id}`)

        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res){
        try{
            let results = await Chef.find(req.body.id)
            const file_id = results.rows[0].file_id

            await Chef.delete(req.body.id)

            await File.delete(file_id)

            return res.redirect("chefs")

        } catch (error) {
            console.error(error)
        }
    }
}