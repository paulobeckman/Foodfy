const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
    async index(req, res){
        let results = await Chef.all()
        const chefs = results.rows.map(chef => ({
            ...chef,
            src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
        }))

        return res.render("admin/chefs/index", {chefs})
    },
    create(req, res){
        return res.render("admin/chefs/create")
    },
    async post(req, res){
        const keys = Object.keys(req.body)
    
        for(key of keys) {
            if (req.body[key] == ""){
                return res.send('Please, fill all fields!')
            }
        }
        
        if (req.files.length == 0){
            return res.send('Please, send at least one image')        

        }

        let results = await File.create(req.files[0])
        const file_id = results.rows[0].id
        
        results = await Chef.create({...req.body, file_id})
        const chefId = results.rows[0].id


        return res.redirect(`chefs/${chefId}/edit`)
    },
    async show(req, res){
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]
        
        ChefAddingSrc = {
            ...chef,
            src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
        }

        return res.render("admin/chefs/show", {chef: ChefAddingSrc})
    }
}