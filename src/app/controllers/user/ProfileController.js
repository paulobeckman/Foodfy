const User = require('../../models/User')
const { compare } = require('bcryptjs')

module.exports = {
    async index(req, res){
        try {
            results = await User.find(req.session.userId)
            const user = results.rows[0]

            return res.render("admin/profile/index", {user})
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res){
        try {
            const { password } = req.body

            const keys = Object.keys(req.body)

            
            for(key of keys) {
                if (req.body[key] == ""){
                    return res.send('Please, fill all fields!')
                }
            }

            let results = await User.find(req.body.id)
            const user = results.rows[0]

            const passed = await compare(password, user.password)

            if(!passed) return res.render("admin/profile/index", {
                user: req.body,
                error: "Senha incorreta."
            })

            await User.update(req.body)

            return res.redirect("/admin/profile")

        } catch (error) {
            console.error(error)
        }
    }
}