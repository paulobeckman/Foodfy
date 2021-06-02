const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'recipe_files' })

module.exports = {
    ...Base,
    find(id){
        try {
            return db.query(`
                SELECT recipe_files.recipe_id, files.path, recipe_files.file_id AS id
                FROM recipe_files 
                LEFT JOIN files ON (files.id = recipe_files.file_id)
                WHERE recipe_id= $1`, [id]
            )
        } catch (error) {
            console.error(error)
        }
    },
    deleteByRecipe(id){
        try{
            return db.query(`DELETE FROM recipe_files WHERE recipe_id = $1`, [id])
            
        } catch (error) {
            console.error(error)
        }
    },
    deleteByFile(id){
        try{
            return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id])
            
        } catch (error) {
            console.error(error)
        }
    }
}