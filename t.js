const express = require('express');
const multer = require('multer');
const path = require('path');
const {exec}= require("child_process");
const app = express();
const port = 8000;
const fs=require("fs");

// Storage configuration for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where uploaded files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, "1.mp3"); // Unique filename
    }
});

const upload = multer({ storage: storage });
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/t.html");
})
// Endpoint for handling file uploads
app.post('/upload', upload.single('mp3File'), (req, res) => {
    exec("ffmpeg -i ./uploads/1.mp3 -acodec pcm_s16le -ac 2 -ar 8000  3.wav",(err,res)=>{
        if(err){
            console.log(err);
        }
    });
    fs.readFile("/home/rnd/pas/3.wav",(err,data)=>{
     res.setHeader('Content-Type','audio/wav');
     console.log(data);
     res.send(data);
    })
});

app.listen(port, () => {
    console.log("Server running at http:\\localhost:${port}");
});