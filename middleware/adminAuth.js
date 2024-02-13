const isAdmin=(req,res,next)=>{
    try {
        if(req.session.admin){
            console.log("inside session")
            
            next()
        }else{
            console.log("outside session");
            res.redirect("/admin")
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports=isAdmin