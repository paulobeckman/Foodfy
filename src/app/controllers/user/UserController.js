const User = require('../../models/User')
const Recipe = require('../../models/Recipes')
const Chef = require('../../models/Chef')
const File = require('../../models/File')
const Recipe_File = require('../../models/Recipe_Files')
const crypto = require('crypto')
const mailer = require('../../../lib/mailer')

module.exports = {
    async list(req, res){
        try {
            let results = await User.all()
            const users = results.rows

            results = await User.find(req.session.userId)
            const loggedUser = results.rows[0].is_admin
            const loggedUserId = results.rows[0].id

            return res.render("admin/users/index", {users, loggedUser, loggedUserId})
        } catch (error) {
            console.error(error)
        }
    },
    create(req, res){
        return res.render("admin/users/create")
    },
    async post(req, res){
        const user = req.body

        try{
            const loggedUserId = req.session.userId

            let results = User.find(loggedUserId)
            const loggedUser = (await results).rows[0]

            if(loggedUser.is_admin === false){
                return res.render("admin/users/index", {
                    error: "Essa conta não é uma conta administradora"
                })
            }

            //uma senha para esse usuário
            const password = crypto.randomBytes(5).toString("hex")

            // enviar um email com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Sua senha de login',
                html: `<h2>Aqui está a sua senha</h2>
                <p>
                    <p>
                        Sua senha: ${password}
                    </p>
                </p>
                `
            })

            await User.create({...req.body, password})

            const userName = req.body.name

            //avisar o usuário que enviamos o email
            return res.render("admin/users/alert/success", {userName})

        }catch(error){
            console.error(error)
            return res.render("admin/users/alert/success")
        }
    },
    async edit(req, res){
        try {
            let results = await User.find(req.params.id)
            const user = results.rows[0]

            return res.render("admin/users/edit", {user})
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res){
        try{
            const keys = Object.keys(req.body)

            for(key of keys) {
                if (req.body[key] == ""){
                    return res.send('Please, fill all fields!')
                }
            }

            await User.update(req.body)

            return res.render(`admin/users/edit`, {
                user: req.body,
                success: "Conta atualizada com sucesso!"
            })
            
        }catch(error){
            console.error(error)
        }
    },
    async delete(req, res){ 
        try {
            //buscando por todas as receitas do usuário
            let results = await Recipe.findByUser(req.body.id)
            const recipes = results.rows

            // se for encontrado receitas, deletar receitas e arquivos img
            if(recipes.length != 0){
                const promisseRecipeFile = recipes.map(async recipe => {
                    let results = await Recipe_File.find(recipe.id)
                    const files = results.rows[0]

                    return {
                        ...files
                    }
                })

                const resultsFiles = await Promise.all(promisseRecipeFile)

                await recipes.map(recipe=>{
                    Recipe_File.deleteByRecipe(recipe.id)
                })

                //deletando arquivos img de receitas
                if(resultsFiles.length > 1){
                    const removedFilesPromise = await resultsFiles.map(file => File.delete(file.id))
                    await Promise.all(removedFilesPromise)
                } else {
                    await File.delete(resultsFiles[0].id)
                }
                
                await recipes.map(recipe =>{
                    Recipe.delete(recipe.id)  
                })
            }



            // if(chef.length != 0){
            //     const promisseChefFile = recipes.map(async recipe => {
            //         results = await Chef.find(recipes.chef_id)
            //         const file_id = results.rows[0].file_id

            //         await Chef.delete(recipe.chef_id)  

            //         return {
            //             ...file_id
            //         }
            //     })

            //     const resultsFiles = await Promise.all(promisseChefFile)

            //     //deletando arquivos img de receitas
            //     if(resultsFiles.length > 1){
            //         const removedFilesPromise = await resultsFiles.rows.map(file => File.delete(file.id))
            //         await Promise.all(removedFilesPromise)
            //     } else {
            //         await File.delete(file.id)
            //     }
            // }

            await User.delete(req.params.id)

            return res.render("admin/users/alert/delete-success")

        } catch (error) {
            console.error(error)
            return res.render("admin/users/alert/delete-error")
        }
    }
}