const db = require('../../config/db')
const { hash } = require('bcryptjs')
const fs = require('fs')
// const Product = require('./Product')

module.exports = {
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
    async create(data) {
        try{
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    is_admin
                ) VALUES ($1, $2, $3, $4)
                RETURNING id
            `
            //has of password
            const passwordHash = await hash(data.password, 8)
            
            const values = [
                data.name,
                data.email,
                passwordHash,
                data.is_admin || false
            ]

            const results = await db.query(query, values)
            return results.rows[0].id

        } catch(err){
            console.error(err)
        }
    },
    async update(data) {
        try {
            const query = `
                UPDATE users SET
                    name = ($1),
                    email = ($2),
                    is_admin = ($3)
                WHERE id = $4
            ` 

            const values = [
                data.name,
                data.email,
                data.is_admin,
                data.id
            ]

            return db.query(query, values)
            
        } catch (error) {
            console.error(error)
        }
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