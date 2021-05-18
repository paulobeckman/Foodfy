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

            return res.render("admin/users/index", {users, loggedUser})
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

            //avisar o usuário que enviamos o email
            return res.render("admin/users/index", {
                success: "Verifique seu email para visualizar sua senha"
            })

        }catch(err){
            console.error(err)
            res.render("admin/users/create", {
                error: "Erro inesperado, tente novamente"
            })
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
    }
}