
const User = require("../model/userModel");
// const bcrypt=require('bcrypt')

const adminEmail=process.env.ADMINEMAIL

const adminPass=process.env.ADMINPASS


const adminLogin=async(req,res)=>{
   try {
      if(req.session.admin){
         res.redirect("/admin/dashboard")
      }else{
         res.render('adminLogin');
      }
      // console.log('hello')
      
   } catch (error) {
    console.log(error.message)
   }
}

const verifyAdmin=async(req,res)=>{
   try {
      // console.log(req.body.email)
      const email=req.body.email
      const password=req.body.password

      
      if(email==adminEmail){
         if(password==adminPass){
            req.session.admin=email
            res.json({status:true})
         }else{
            res.json({status:'passErr'})
         }
      }else{
         res.json({status:'emailErr'})
      }

   } catch (error) {
      console.log(error.message)
   }
}

const loadDash=async(req,res)=>{
   try {
      res.render('adminDash')
   } catch (error) {
      console.log(error.message)
   }
}

const loadSellers=async(req,res)=>{
   try {
      const userData=await User.find({})
      // console.log(userData)
      res.render('adminSellers',{userData})
   } catch (error) {
      console.log(error.message)
   }
}

const blockUser=async(req,res)=>{
   try {
     const id=req.query.id
     const findUser=await User.findById({_id:id})
     
     if(findUser.is_blocked==false){
       const userData=await User.findByIdAndUpdate({_id:id},
       {$set:{
         is_blocked:true
      }})
   }

      res.redirect('/admin/sellers')
     
   } catch (error) {
     console.log(error.message)
   }
 }

 const unblockUser=async(req,res)=>{
   try {
      const id=req.query.id
      
      const findUser=await User.findById({_id:id})
     
     if(findUser.is_blocked==true){
       const userData=await User.findByIdAndUpdate({_id:id},
       {$set:{
         is_blocked:false
      }})

   }
   res.redirect('/admin/sellers')
     

   } catch (error) {
      console.log(error.message)
   }
 }

 const logout=async(req,res)=>{
   try {
     delete req.session.admin
     res.redirect('/admin')
   } catch (error) {
      console.log(error)
   }
 }



module.exports={
   adminLogin,
   verifyAdmin,
   loadDash,
   loadSellers,
   blockUser,
   unblockUser,
   logout
   
}  