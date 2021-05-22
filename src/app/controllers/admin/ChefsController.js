const User = require('../../models/User')
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

            results = await User.find(req.session.userId)
            const loggedUser = results.rows[0].is_admin   

            return res.render("admin/chefs/index", {chefs, loggedUser})
                    
        } catch (error) {
            console.error(error)
        }
    },
    create(req, res){
        return res.render("admin/chefs/create")
    },
    async post(req, res){
        try {
            let results = await File.create(req.files[0])
            const file_id = results.rows[0].id
            
            results = await Chef.create({...req.body, file_id})
            const chefId = results.rows[0].id

            const chefName = req.body.name

            return res.render(`admin/chefs/alert/success`, {chefName})

        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/alert/error')
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

            results = await User.find(req.session.userId)
            const loggedUser = results.rows[0].is_admin   

            return res.render("admin/chefs/show", {chef: ChefAddingSrc, recipes: recipeFile, loggedUser})

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
            if(req.files.length != 0){
                let results = await File.create(req.files[0])
                const file_id = results.rows[0].id

                await Chef.updateFileId(file_id)
            }
                    
            if (req.body.removed_files){
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
                
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                
                await Promise.all(removedFilesPromise)
            }

            await Chef.updateName(req.body)

            return res.redirect(`chefs/${req.body.id}`)

        } catch (error) {
            console.error(error)
            return res.render({success: "Chef atualizado com sucesso!"})
        }
    },
    async delete(req, res){
        try{
            let results = await Recipe.findByChefs(req.body.id)
            const recipes = results.rows

            // se for encontrado receitas, deletar receitas e arquivos img
            if(recipes){
                const promisseRecipeFile = recipes.map(async recipe => {
                    let results = await Recipe_File.find(recipe.id)
                    const files = results.rows

                    let fil = []

                    files.map(file => fil.push(file))

                    return fil
                })

                const resultsFiles = await Promise.all(promisseRecipeFile)

                await recipes.map(recipe => {
                    Recipe_File.deleteByRecipe(recipe.id)
                })

                //deletando arquivos img de receitas
                const removedFilesPromise = await resultsFiles.map(file => file.map(findFile => File.delete(findFile.id)))
                await Promise.all(removedFilesPromise)

                await recipes.map(recipe =>{
                    Recipe.delete(recipe.id)  
                })
            }

            results = await Chef.find(req.body.id)
            const file_id = results.rows[0].file_id

            await Chef.delete(req.body.id)

            await File.delete(file_id)

            return res.render("admin/chefs/alert/delete-success")

        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/alert/delete-error')
        }
    }
}