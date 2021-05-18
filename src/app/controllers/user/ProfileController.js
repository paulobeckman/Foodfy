const User = require('../../models/User')

module.exports = {
    async index(req, res){
        try {
            results = await User.find(req.session.userId)
            const user = results.rows[0]

            return res.render("admin/profile/index", {user})
        } catch (error) {
            console.error(error)
        }
    }
}