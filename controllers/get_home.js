module.exports=async(req,res)=>{
    if(req.session.is_logged_in)
    {
        return res.render("todo", { user: req.session.username })
    }
    else{
        return res.redirect("/login")
    }
}