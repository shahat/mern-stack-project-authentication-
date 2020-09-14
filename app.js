
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

/* */
////////////////////////////////////
const userSchema={
    email:String,
    password:String


}
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

app.post('/register',function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(err => err ? console.log(err):res.render("secrets"))
})





app.listen(3000,function (){
    console.log("server started on port 3000 .")
})