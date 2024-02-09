const isAdmin=(req,res,next)=>{
    try {
        if(req.session.admin){
            
            next()
        }else{
            console.log("helloo");
            res.redirect("/admin")
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports=isAdmin