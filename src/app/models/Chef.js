const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
    all() {
        try {
            return db.query(`SELECT chefs.*, count(recipes) AS total_recipes,files.path
                FROM chefs
                INNER JOIN files ON (files.id = chefs.file_id)
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                GROUP BY chefs.id, files.path
                ORDER BY name ASC`
            )
        } catch (error) {
            console.error(error)
        }
    },
    find(id) {
        try {
            return db.query (`
                SELECT chefs.*, count(recipes) AS total_recipes, files.path
                FROM chefs
                INNER JOIN files ON files.id = chefs.file_id
                LEFT JOIN recipes ON chefs.id = recipes.chef_id
                WHERE chefs.id = $1
                GROUP BY chefs.id, files.path`, [id]
            )  
        } catch (error) {
            console.error(error)
        }
    },
    files(id){
        try{
            return db.query(`
                SELECT * 
                FROM files 
                WHERE id = (SELECT chefs.file_id
                    FROM chefs
                    WHERE chefs.id = $1)`, [id]
            ) 

        } catch (error) {
            console.error(error)
        }
    }
}