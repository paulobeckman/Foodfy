const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
    index(req, res){
        return res.render("admin/chefs/index")
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
        
        let results = await Chef.create(req.body)
        const chefId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({...file}))
        await Promise.all(filesPromise)

        return res.redirect(`chefs/${chefId}/edit`)
    }
}