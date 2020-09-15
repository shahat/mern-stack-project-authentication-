/* this the third layer to keep your api and secret massage secure 
using enviromental variables */
require('dotenv').config();
const md5 = require("md5")
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { userInfo } = require("os");
const { stringify } = require("querystring");
const session = require('express-session');
const passport= require("passport");
const passportLocalMongoose= require ("passport-local-mongoose");

/* use app  */
const app = express();

/*  */
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use(session({
    secret:"our little secret ",
    resave:false,
    resave: true,
    saveUninitialized: true

}));
app.use(passport.initialize()) ;
app.use(passport.session())
const GoogleStrategy = require('passport-google-oauth20').Strategy;

/*   *****************   */
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);


/* connect mongoose to our local database called wekidb  */
mongoose.connect("mongodb://localhost:27017/userDB");

 // add layer 2 add encription 
 var encrypt = require('mongoose-encryption'); 
 
////////////////////////////////////

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User",userSchema);
passport.use(User.createStrategy())



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())//destroy cookes to see the image inside it 


///////////////////get req////////////////////////////

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
           req.logout;
           res.redirect("/")
            });  

app.get("/secrets",function(req,res){
      if(req.isAuthenticated()) {
          res.render("secrets");
      }else{
         res.redirect("/login") 
      }   
                });  
/* using passport for log in authentication  */
////////////////////post ////////////////////////////

app.post('/register',function(req,res){
   User.register({username:req.body.username},req.body.password,function(err,user){
       if(err){
           console.log(err) ;
           res.redirect("/register")
       }else{
           passport.authenticate("local")(req,res,function(){
               res.redirect("/secrets")
           })
       }
   })
});

app.post("/login",function(req , res ){
    const user = new User({ // make user to compare it by my database user 
        username:req.body.username,
        password:req.body.password
    });
    req.login(user,function(err){//log in is a passport fun
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets")
            })
        }
    })
    
});
app.listen(3000,function (){
    console.log("server started on port 3000 .")
})