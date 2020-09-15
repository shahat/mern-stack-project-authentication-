/* this the third layer to keep your api and secret massage secure 
using enviromental variables */
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { userInfo } = require("os");
const { stringify } = require("querystring");
/* use app  */
const app = express();
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
/* connect mongoose to our local database called wekidb  */
mongoose.connect("mongodb://localhost:27017/userDB");
app.set('view engine', 'ejs');
/*  */
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 // add layer 2 add encription 
 var encrypt = require('mongoose-encryption'); 
////////////////////////////////////

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt, { secret:process.env.SECRET , incryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);


app.get("/", function(req,res){
res.render("home")
});
app.get("/login", function(req,res){
    res.render("login")
    });
app.get("/register",function(req,res){
        res.render("register")
        });
app.get("/logout",function(req,res){
            res.render("home")
            });       

app.post('/register',function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(err => err ? console.log(err):res.render("secrets"))
})
app.post("/login",function(req , res ){
    const username = req.body.username;
    const password = req.body.password;
  // to check that if the user how is trying to log in is already in database or not 
  User.findOne({ email:username},function(err,foundUser){
if (err){
    console.log(err)
}else{
    if(foundUser){
        if(foundUser.password===password){
            res.render("secrets")
        }
    }
}
    
  })
});








app.listen(3000,function (){
    console.log("server started on port 3000 .")
})