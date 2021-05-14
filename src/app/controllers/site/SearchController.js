const Recipes = require ('../../models/Recipes')
const Recipe_File = require ('../../models/Recipe_Files')

module.exports = {
    async index(req, res){
        try {
            let { filter } = req.query

            let results = await Recipes.search(filter)
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
            
            return res.render("site/search/index", {recipes: recipeFile, filter})
        } catch (error) {
            console.error(error)
        }
    }
}