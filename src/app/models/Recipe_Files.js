const db = require('../../config/db')

module.exports = {
    create(data){
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            )   VALUES ($1, $2)
            RETURNING id          
        `

        const values = [
             data.recipe_id,
             data.file_id
        ]

        return db.query(query, values)
    },
    find(id){
        try {
            return db.query(`
                SELECT recipe_files.recipe_id, files.path, recipe_files.file_id AS id
                FROM recipe_files 
                LEFT JOIN files ON (files.id = recipe_files.file_id)
                WHERE recipe_id= $1`, [id]
            )
    
        } catch (error) {
            console.log(error)
        }
    },
    update(data){
        try {
        const query = `
            UPDATE recipe_files SET
                file_id = ($1)
            WHERE recipe_id = $2
        `
        
        const values = [
            data.file_id,
            data.recipe_id
        ]

        return db.query(query, values)

        } catch (error) {
            console.error(error)
        }
    },
    // deleteByFile(id){
    //     return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id])
    // },
    deleteByRecipe(id){
        return db.query(`DELETE FROM recipe_files WHERE recipe_id = $1`, [id])
    }
}
