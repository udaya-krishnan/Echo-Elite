

const islogin=async(req,res,next)=>{
  try {

   
    if(req.session.email){
      
        next()
    }else{
      
        res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message)
  }
}

const isLogOut=async(req,res,next)=>{
    try {
      
         if(req.session.email){
 
           res.redirect("/home")
        }else{
          
            next()
        }
    } catch (error) {
        console.log(error.message)
    }
}


module.exports={islogin,isLogOut}