const mongoose=require("mongoose")

require('dotenv').config()

const uri = "mongodb+srv://udayankrishnan36:M4olyzIijyjz0nRF@cluster0.o5mynnz.mongodb.net/udayankrishnan36?retryWrites=true&w=majority&appName=Cluster0"
function connectDb(){
    // mongoose.connect("mongodb://localhost:27017/E-commerce")
    mongoose.connect(uri)
    .then(()=>{ 
        console.log("connect")
    })
}

connectDb()

const session=require("express-session")
const {v4:uuidv4}=require("uuid")
const nocache=require("nocache")

const bodyParser=require('body-parser')

const express=require("express")
const app=express();

console.log("hello")

const path=require("path");


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/static", express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))
app.use(express.static('views'))

app.use(session({
    secret:process.env.SESSIONSECRET,
    resave:true,
    saveUninitialized:true
}))

app.use(nocache())
//***********************for userRoute ***********************************

const  userRoute=require('./router/userRoute');

app.use('/',userRoute)  
       

//****************************FOR ADMIN ROUTE ****************************/

const adminRoute=require('./router/adminRoute')
app.use('/admin',adminRoute)

app.get("*",(req,res)=>{
    res.redirect("/404")
})
console.log("hai server");
app.listen(8081,`0.0.0.0`,()=>{



})  