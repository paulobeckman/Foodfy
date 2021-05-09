const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipes')

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

        results = await Recipe.findByChefs(req.params.id)
        const recipes = results.rows

        return res.render("admin/chefs/show", {chef: ChefAddingSrc, recipes})
    },
    async edit(req, res){
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if(!chef) return res.send("Chef not found!")
        
        //get image
        results = await Chef.files(chef.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/chefs/edit", {chef, files})
    },
    async update(req, res){
        const keys = Object.keys(req.body)
    
        for(key of keys) {
            if (req.body[key] == ""){
                return res.send('Please, fill all fields!')
            }
        }

        // if(req.files.length != 0){
        //     const newFilesPromise = req.files.map(file =>
        //         results = File.create({...file})
        //     )

        //     await Promise.all(newFilesPromise)
        // }

        let results = await File.create(req.files[0])
        const file_id = results.rows[0].id
        
        await Chef.update({...req.body, file_id})

        if (req.body.removed_files){
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }

        return res.redirect(`admin/chefs/${req.body.id}`)
    }
}