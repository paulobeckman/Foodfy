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
                    email = ($2) 
                WHERE id = $3
            ` 

            const values = [
                data.name,
                data.email,
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
    // async delete(id){
    //     //pegar todos os produtos 
    //     let results = await db.query("SELECT * FROM products WHERE user_id = $1", [id])
    //     const products = results.rows

    //     //dos produtos, pegar todas as imagens
    //     const allFilesPromise = products.map(product => Product.files(product.id))
    //     let promiseResults = await Promise.all(allFilesPromise) 

    //     //rodar a remoção do usuário
    //     await db.query('DELETE FROM users WHERE id = $1', [id])
        
    //     //remover as imagens da pasta public
    //     promiseResults.map(results => {
    //         results.rows.map(file => {
    //             try{
    //                 fs.unlinkSync(file.path)
    //             }catch(err){
    //                 console.error(err)
    //             }
    //         })
    //     })
    // },
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