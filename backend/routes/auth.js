const express = require("express");
const mongoose = require("mongoose");
const router=express.Router()
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const {Jwt_secret} = require("../key");
const jwt = require("jsonwebtoken");
const requireLogin= require("../middlewares/requireLogin")

router.get('/',(req,res)=>{
    res.send("hello")
})

router.post('/signup',(req,res)=>{
    const {name, userName, email, password }=req.body;
    if (!name || !userName || !email || !password){
   return res.status(422).json({error:"please add all the fields"})}
USER.findOne({$or:[{email: email},{userName:userName}]}).then((savedUser)=>{
    if(savedUser){
        return res.status(422).json({error:"user exist with this email or userName"})
    }
    bcrypt.hash(password,12).then((hpassword)=>{
        const user= new USER ({
            name,
            email,
            userName,
            password:hpassword
        })
        user.save()
        .then(user => { res.json({message:"saved successfully"})})
        .catch(err=>{console.log(err)})

    })
   
})
   
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    if (!email || !password) {
        return res.status(422).json({error:'Please add email and password'})
    }
    USER.findOne({email:email}).then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:'Invalid Email'})
        }
        bcrypt.compare(password,savedUser.password).then((match)=>{
            if(match){
                // return res.status(200).json({message:"signed in successfully"})
                const token = jwt.sign({_id:savedUser.id},Jwt_secret)
                res.send(token)
                console.log(token)
            }else{
                return res.status(422).json({error:"Password incorrect"})
            }

        })
        .catch(err=>{console.log(err)})
    })
})
module.exports=router;