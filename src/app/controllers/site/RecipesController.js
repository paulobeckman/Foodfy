const Recipe = require('../../models/Recipes')
const Recipe_File = require('../../models/Recipe_Files')

module.exports = {
    async index(req, res){
        try{
            let results = await Recipe.all()
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
            
            return res.render("site/recipes/index", {recipes: recipeFile})

        } catch (error) {
            console.error(error)
        }
    },
    async show (req, res){
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

            return res.render("site/recipes/show", {recipe: RecipeFiles})
            
        } catch (error) {
            console.error(error)
        }
    }
}