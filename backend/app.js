const express = require("express");
const cors = require("cors");
const mongoose=require("mongoose")
const {mongoURL} = require('./key.js')
const App= express();
App.use(express.json())
App.use(cors())
require('./models/model')
require('./models/post')

App.use(require('./routes/auth.js'))
App.use(require("./routes/createPost.js"))


const PORT =5000;

mongoose.connect(mongoURL)
mongoose.connection.on("connected",()=>{
    console.log("connected to mongodb")
})
mongoose.connection.on("error",()=>{
    console.log("not connected to mongodb")
})


App.listen(PORT,()=>{
    console.log("Server running in "+ PORT)
})
