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
      // console.log("isLogout rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
      
         if(req.session.email){
            // console.log("sessionnnnnnnnnnnnnnnnnnnnnnn");
           res.redirect("/home")
        }else{

        // console.log("with out sessionssssssssssssssssssssssssssssssssssssss");
          
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

    if(findUser){

      if(findUser?.is_blocked==true){
          console.log("is blocked")
          res.render("login")
        }else{
          next()
        }
    }
    
    }else{
      next()
    }
  } catch (error) {
    console.log(error.message)
  }
}


module.exports={islogin,isLogOut,isBlocked}