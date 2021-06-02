const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base,
    all(){
        try {
            return db.query(`
                SELECT *
                FROM users
            `)
        } catch (error) {
            console.error(error)
        }
    },
    async findOne(filters){
        let query = "SELECT * FROM users"

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}
            `

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)
        return results.rows[0]
    },
    async delete(id){
        try {
            return db.query(`
                DELETE FROM users
                WHERE id = $1`, [id]
            )
        } catch (error) {
            console.error(error)
        }
    },
    find(id){
        try {
            return db.query(`
                SELECT *
                FROM users
                WHERE id = $1
            `, [id])
        } catch (error) {
            console.error(error)
        }
    }
}