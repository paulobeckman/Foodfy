const Chef = require('../../models/Chef')

module.exports = {
    async index(req, res){
        try {
            let results = await Chef.all()
            const chefs = results.rows.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
            }))

            return res.render("site/chefs/index", {chefs})
                    
        } catch (error) {
            console.error(error)
        }
    }
}