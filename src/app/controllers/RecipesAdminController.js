module.exports = {
    index(req, res){
        return res.render("admin/recipes/index")
    },
    create(req, res){
        return res.render("admin/recipes/create")
    }
}