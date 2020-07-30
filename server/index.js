const express = require('express');
const cors = require('cors');
const monk = require('monk'); //to talk to DB
const rateLimit = require("express-rate-limit");


const app = express();


// in mongodb if DB does not exist it will be created and if  collection does not exist it will be created
const db = monk('localhost/messanger'); // messanger db name
const msgs = db.get('msgs'); // collection in DB



// using as a middleware
app.use(cors());
app.use(express.json());



//1st req is always a get request
app.get('/', (req , res) => {
    res.json({
        message: "Whats up bro !!!"
    });  
});


app.get('/msgs', (req , res)=> {
    msgs.find()
    .then(msgs => {
        res.json(msgs);
    });
});



function isValidMsg(msg){
    return msg.name && msg.name.toString().trim() !== '' && msg.content && msg.content.toString().trim() !== '' 
}


app.use(rateLimit({
    windowMs: 10 * 1000, //
    max : 1 // limit each ip to 1 req per 30secs
}));



app.post("/msgs" , (req ,res) => {
    //console.log(req.body);

    if(isValidMsg(req.body)){
        //insert to DB
        const msg = {
            name : req.body.name.toString(),
            content : req.body.content.toString(),
            created: new Date()
        };
       
        //console.log(msg);
        msgs.insert(msg)
        .then(createdMsg => {
            res.json(createdMsg);
        });
    }else{
        res.status(422);
        res.json({
            message : "Hey ! Name and Content are required !"
        });
    }
});


app.listen(5000, ()=>{
    console.log("LISTENING ON http://localhost:5000");
});