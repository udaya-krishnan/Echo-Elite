const mongoose=require("mongoose")

function connectDb(){
    // mongoose.connect("mongodb://localhost:27017/E-commerce")
    const uri = "mongodb+srv://udayan:udayan2003@cluster0.wa6vfuy.mongodb.net/E-commmerce?retryWrites=true&w=majority&appName=Cluster0";
    mongoose.connect(uri)
    .then(()=>{ 
        console.log("connect")
    })
}

connectDb()

require('dotenv').config()
const session=require("express-session")
const {v4:uuidv4}=require("uuid")
const nocache=require("nocache")

const bodyParser=require('body-parser')

const express=require("express")
const app=express();

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

app.listen(2003,()=>{
    console.log("server Running")
})  