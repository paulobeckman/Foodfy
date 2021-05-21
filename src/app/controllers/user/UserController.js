const User = require('../../models/User')
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

            return res.redirect(`/admin/users/${req.body.id}/edit`)
        }catch(error){
            console.error(error)
        }
    },
    async delete(req, res){
        try {
            await User.delete(req.params.id)
            return res.render("admin/users/alert/delete-success")

        } catch (error) {
            console.error(error)
            return res.render("admin/users/alert/delete-error")
        }
    }
}