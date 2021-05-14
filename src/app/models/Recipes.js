const db = require('../../config/db')

module.exports = {
    all() {
        try{
            return db.query(`
                SELECT recipes.*, chefs.name AS chef_name 
                FROM recipes 
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ORDER BY recipes.created_at DESC`
            )
        } catch(error){
            console.error(error)
        }
    },
    create(data) {
        try{
            const query = `
                INSERT INTO recipes(
                    chef_id,
                    title,
                    ingredients,
                    preparations,
                    information
                ) VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            `

            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.preparations,
                data.information
            ]

            return db.query(query, values)

        } catch (error) {
            console.error(error)
        }

    },
    find(id) {
        try{
            return db.query (`
                SELECT recipes.*, chefs.name AS chef_name 
                FROM recipes 
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.id = $1`, [id]
            )
        }catch(error){
            console.error(error)
        }
    },
    findByChefs(id){
        try{
            return db.query(`
                SELECT recipes.title, recipes.id
                FROM recipes 
                WHERE recipes.chef_id = $1
                ORDER BY recipes.created_at DESC`, [id]
            )

        } catch (error) {
            console.error(error)
        }
    },
    update(data) {
        try{
            const query = (`
                UPDATE recipes SET
                    chef_id = ($1),
                    title = ($2),
                    ingredients = ($3),
                    preparations = ($4),
                    information = ($5)
                WHERE id = $6
            `)

            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.preparations,
                data.information,
                data.id
            ]

            return db.query(query, values)
            
        } catch (error) {
            console.error(error)
        }
    },
    delete(id) {
        try{
            return db.query(`
                DELETE FROM recipes
                WHERE id = $1`, [id]
            )

        } catch(err){
            console.error(err)
        }
    },
    search(filter){
        try {
            return db.query(`
                SELECT recipes.title, recipes.id, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.title ILIKE '%${filter}%'
                ORDER BY recipes.updated_at DESC
            `)
        } catch (error) {
            console.error(error)
        }
    }
}