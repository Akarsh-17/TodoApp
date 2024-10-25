module.exports=async(req,res)=>{
//     const error = req.session.error;
//   delete req.session.error;
    if(req.session.is_logged_in)
    {
        return res.redirect("/")
    }
    else{
        res.render("login", { err: false })  //
    }
}