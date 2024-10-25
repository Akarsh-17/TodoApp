module.exports=async(req,res)=>{
    if(req.session.is_logged_in) return res.redirect("/");
    return res.render("register",{err:false})
}