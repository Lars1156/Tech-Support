const express = require('express');
const bodyParser = require('body-parser');
const {connection}= require('./connection');
const routerAPI = require('./Router/api');
const cros = require('cors');
const app = express();

// Database Connection 
connection('mongodb://localhost:27017/tech-Support').then(()=>{
    console.log("Database Connection is Sucessfully");
    
}).catch((error)=>{
    console.log("Connection Faild to data base", error);
    
})

// Frontend to Backend Connection Using Cros
crosOption = {
    origin:'http://localhost:3000',
    optionSuccessfulStatus: 200
}


// Middle ware
app.use(express.json());
app.use(bodyParser.json());
app.use(cros(crosOption));
app.use('/api',routerAPI);

// LocalHost Server Handlling
app.listen(4005, ()=>{
    console.log("Server Is Running on port 4005");
    
})