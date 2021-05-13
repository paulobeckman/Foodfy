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
    }
}