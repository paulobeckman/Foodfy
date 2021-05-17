module.exports = {
    list(req, res){
        return res.render("admin/users/index")
    },
    create(req, res){
        return res.render("admin/users/create")
    },
    edit(req, res){
        return res.render("admin/users/edit")
    }
}