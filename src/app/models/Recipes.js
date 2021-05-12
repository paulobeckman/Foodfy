const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    all() {
        try{
            return db.query(`
                SELECT recipes.*, chefs.name AS chef_name 
                FROM recipes 
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ORDER BY title ASC`
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
                    information,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `

            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.preparations,
                data.information,
                date(Date.now()).iso
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
                WHERE recipes.chef_id = $1`, [id]
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
    }
}