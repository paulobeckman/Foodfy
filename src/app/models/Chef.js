const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    all() {
        try {
            return db.query(`SELECT chefs.*, files.path
                FROM chefs
                LEFT JOIN files ON (files.id = chefs.file_id)
                ORDER BY name ASC`
            )

        } catch (error) {
            console.error(error)
        }
    },
    create(data) {
        try{
            const query = `
                INSERT INTO chefs( 
                    name,
                    file_id,
                    created_at
                ) VALUES ($1, $2, $3)
                RETURNING id
            `
            const values = [
                data.name,
                data.file_id,
                date(Date.now()).iso
            ]

            return db.query(query, values)

        }catch(error){
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
    update(data){
        try {
            const query = `
                UPDATE chefs SET
                    name = ($1)
                    file_id = ($2) 
                WHERE id = $3
            ` 

            const values = [
                data.name,
                data.file_id,
                data.id
            ]

            return db.query(query, values)
            
        } catch (error) {
            console.error(error)
        }

    },
    files(id){
        return db.query(`
            SELECT * 
            FROM files 
            WHERE id = (SELECT chefs.file_id
                FROM chefs
                WHERE chefs.id = $1)`, [id]
        ) 
    },
    // findRecipesChef(id, callback) {
    //     db.query (`
    //     SELECT chefs.*, recipes.title AS recipes_title, recipes.image AS recipes_image
    //     FROM chefs
    //     LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
    //     WHERE chefs.id = $1`, [id], function (err, results) {
    //             if(err) throw `Database error ${err}`

    //             callback(results.rows)
    //         }
    //     )
    // },
    // delete(id, callback) {
    //     db.query(`
    //         DELETE FROM chefs
    //         WHERE id = $1`, [id], function (err, results) {
    //             if (err) throw `Database Error! ${err}`

    //             return callback()
    //         }
    //     )
    // },
    // AllChefs(callback){
    //     db.query (`
    //     SELECT chefs.*, count(recipes) AS total_recipes
    //     FROM chefs
    //     LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
    //     GROUP BY chefs.id`, function(err, results){
    //         if(err) throw `Database error ${err}`

    //         callback(results.rows)
    //     }
    //     )
    // }
}