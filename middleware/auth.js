const User=require("../model/userModel")

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

const isBlocked=async(req,res,next)=>{
  try {
    if(req.session.email){
        const findUser=await User.findOne({email:req.session.email})

        if(findUser.is_blocked==true){
          res.render("login")
        }else{
          next()
        }
    }else{
      next()
    }
  } catch (error) {
    console.log(error.message)
  }
}


module.exports={islogin,isLogOut,isBlocked}