//15-12-2023
const path = require("path");
const fs = require("fs");
const express = require("express");
const WebSocket = require("ws");
const FileApi=require("file-api");
const Fs = require('fs').promises;
const FileReader=require("filereader");
const multer = require('multer');
const app = express();
const upload = multer({ dest: 'uploads/' });
const WS_PORT = process.env.WS_PORT || 8888;// hop by hop
const HTTP_PORT = 8000 ;//end to end 
const mysql = require('mysql2');
const {exec}= require("child_process");
require("dotenv").config();
const session =require('express-session');
const cookie_parser=require('cookie-parser');
File = FileApi.File;
const MySqlStore= require('express-mysql-session')(session);
  const con = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database:process.env.database
});
var sessionStore=new MySqlStore({
  expiration:600000,
  createDatabaseTable:true,
  schema:{
    tableName:'session',
    columnNames:{
      session_id:'session_id',
      expires:'expires',
      data:'userinfo'
    }
  },
},con);
app.use(cookie_parser())
app.use(session({
  key:'userinfo',
  secret:'secret key',
  store:sessionStore,
  resave:false,
  saveUninitialized:true
}));
app.set('view engine', 'ejs');

app.use("/images", express.static("images"));
app.use(express.static("public"));
const wsServer= new WebSocket.Server({ port: WS_PORT }, () =>
  console.log('WS server is listening at ws://45.249.79.39:${WS_PORT}') 
  );
console.log(wsServer);
// array of connected websocket clients
let connectedClients = [];
app.use(express.json());       
app.use(express.urlencoded({extended: true}));
app.use("/js", express.static("js"));




wsServer.on("connection", (ws, req) => {   
    con.query(
        `SELECT * FROM Client WHERE client_ip = ?`,
        [ req.headers['x-forwarded-for']],
        (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            // If the client doesn't exist, insert a new record
            if (result.length === 0) {
                con.query(
                    `INSERT INTO Client (client_ip,connection) VALUES (?, 'Connected')`,
                    [ req.headers['x-forwarded-for']],
                    (err, result) => {
                        if (err) {
                            console.error(err);
                        }
                    }
                );
            }
            
             else {
                con.query(
                    `UPDATE Client SET connection = 'Connected' WHERE client_ip = ?`,
                    [ req.headers['x-forwarded-for']],
                    (err, result) => {
                        if (err) {
                            console.error(err);
                        }
                    }
                );
            }
            
        }
    );
 
  // add new connected client
  connectedClients.push(ws);
  
  
  ws.on("close", () => {
        con.query(
            `UPDATE Client SET connection = 'Disconnected' WHERE client_ip = ?`,
            [req.headers['x-forwarded-for']],
            (err, result) => {
                if (err) {
                    console.error(err);
                }
            }
        );
        con.query(`update broadcast set flag=0`,function(err,result){
           if(err) throw err;
           console.log("hello");
        });
        console.log("bllo");
        });
  
  // listen for messages from the streamer, the clients will not send anything so we don't need to filter
  ws.on("message", (data) => {  
   //console.log("Message: ",data);
   con.query(
     `UPDATE broadcast SET flag = 1`,
         (err, result) => {
            if (err) console.error(err);  });
    connectedClients.forEach((ws, i) => {
      if (ws.readyState === ws.OPEN  ) {
       
       ws.send(data);
      } else {
        connectedClients.splice(i, 1);
      }
    });
  });
  
  
  
  
  
});  


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null,1 +".mp3");//Appending .jpg
  }
});
var uploads = multer({ storage: storage }).single("file");


app.post("/b", (req, res) => { 
//console.log(req.body);
   con.connect(function (err) {
    if (err) {
        console.log(err);
        }
    }); 
   var flag=req.body.flag;
 //  console.log(JSON.parse(req.body.flag));
     con.query(`update broadcast SET flag='${req.body.flag}'`,function(err,result){
    if(err) throw err;
  });
 //  console.log(flag);
  var sql = `UPDATE Client SET status='broadcast' where client_ip=?`;
  con.query(sql,[req.headers['x-forwarded-for']],function(err,result)
  
   {
    if(err) throw err;
    
      });
  res.sendStatus(200);
});
app.post("/login", (req, res) => { 
   if(req.sessionID && req.session.userinfo){
   res.redirect("/b");
   }
   con.connect(function (err) {
    if (err) {
        console.log(err);
        }
    }); 
   
  var sql =`select * from admin_registration where username='${req.body.username}' and    password='${req.body.password}'`;
  con.query(sql,function(err,result)
   {
    if(err) throw err;
    
    if(result.length>=1)
    {
      req.session.userinfo=req.body.username;
      res.redirect("/b");
    }
    else{
      res.sendFile(path.resolve(__dirname, "./login.html"))
    }
      });
});
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});


app.post("/adminlogin", (req, res) => {
console.log("hello");
con.connect(function (err) {
    if (err) {
    console.log(err);
    }
})
var sql = `select * from admin_credentials where username='${req.body.username}' and password='${req.body.password}'`;
  con.query(sql,function(err,result)
   {
    if(err) throw err; 
    if(result.length==1)
    {
      req.session.userinfo=req.body.username;
      res.redirect("/adminreg");
    }
    else{
      res.redirect("/a");
    }
  });
});

app.post("/r", (req, res) => {
if(!(req.sessionID && req.session.userinfo)){
    res.redirect("/a");
}
con.connect(function (err) {
    if (err) {
    console.log(err);
    }
})
var sql =` insert into admin_registration(username,empid,email,password) values('${req.body.username}','${req.body.empid}','${req.body.email}','${req.body.password}')`;
  con.query(sql,function(err,result)
   {
    if(err) throw err;
    if(result.length==1)
    {
      res.send(alert(result));
    }
    else{
      res.sendFile(path.resolve(__dirname, "./adminlog.html"))
    }
  });
});

function checkAlive() {
	//console.log("[Server] Total number of connected clients: " + wsServer.clients.size);
 con.query(`select flag from broadcast`,function(err,result){
const emptyBuffer = new Int16Array(1024);
console.log(result[0].flag)
   if(result[0].flag==0){
      connectedClients.forEach((ws, i) => {
        ws.send(emptyBuffer.buffer);
   });
   }
   
 });
  
  
}
  setInterval(function () {
    checkAlive();
  }, 100);
  
  
app.get("/",(req,res)=>{
if(req.sessionID && req.session.userinfo){
res.redirect("/b");
}
else{
 res.sendFile(path.resolve(__dirname, "./login.html"))
 }
  } );
  
  
  
async function deleteFile(filePath) {
  try {
    await Fs.unlink(filePath);
    console.log(`File ${filePath} has been deleted.`);
  } catch (err) {
    console.error(err);
  }
}  
  
function wavsave(req,res,result){
    uploads(req,res,(err)=>{
        if(err){
        console.log(err);
        }
        else{
            console.log("query")
             exec(`ffmpeg -i uploads/1.mp3 -acodec pcm_s16le  -ac 1 -ar 16000 uploads/1.wav`,(err,std=>{
            if(err){
                console.log(err)
            }
            else{
                res.download("1.wav",()=>{
                    console.log("File is downloaded");
                    
        var file = new File("uploads/1.wav");
        const reader = new FileReader();
        var flag1=result;
        reader.onload = async(event) => {
            const arrayBuffer = event.target.result;
            const chunkSize = 2972; // Adjust chunk size as needed
            let offset = 0;
            let i=0;
            while (offset < arrayBuffer.byteLength) {
                const chunk = arrayBuffer.slice(offset, offset + chunkSize); 
                
                connectedClients.forEach((ws,i)=>{ 
                ws.send(chunk);
                })
                offset += chunkSize;
                if(arrayBuffer.byteLength - offset<=20){updateStatus('0'); flag1=0;}
                if(flag1==0){
            deleteFile("uploads/1.mp3");
            deleteFile("uploads/1.wav");
                return;}
                
               await new Promise(resolve => setTimeout(resolve,70));
            }
            deleteFile("uploads/1.mp3");
            deleteFile("uploads/1.wav");
        };
        reader.readAsArrayBuffer(file);
                    
                    
                    
                    
                });
            }
           }))
        }
    })
}
  
function updateStatus(flag) {

  fetch('http://45.249.79.39/b', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      
      flag:flag,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Broadcast status updated:', data);
    })
    .catch(error => {
    
    });

}
  
  
  
app.post("/mp3towav",(req,res)=>{
con.query(`select flag from broadcast`,function(err,result){
if(err)console.log(err);
console.log("result");
console.log(result[0].flag);
if(result[0].flag==0){
con.query(`update broadcast SET flag='1'`,function(err,result){
    if(err) throw err;
    console.log(result);
  });
wavsave(req,res,1)
}
});
con.query(`update broadcast SET flag='0'`,function(err,result){
    if(err) throw err;
  });
});
app.post("/checkBroadcast",(req,res) =>{
  con.connect(function(err){
  if(err){
  console.log(err);
  }
  });
  con.query(`select * from broadcast`,(err,result)=>{
  if(err) throw err;
  res.json({flags:result[0].flag})
  });
  });
  
  
  
app.get("/b",(req,res)=>{
    if(req.sessionID && req.session.userinfo){
    res.sendFile(path.resolve(__dirname,"./broadcast.html"));
    }
    else{
    res.redirect("/");
    }
    
});

app.get("/logout", (req,res)=>{
  req.session.destroy((err)=>{    
     res.redirect("/");
  });
});
app.get("/adminlogout", (req,res)=>{
  req.session.destroy((err)=>{
     res.redirect("/a");
  });
});

app.get("/adminreg",(req,res)=>{
   if(req.sessionID && req.session.userinfo){
       res.sendFile(path.resolve(__dirname, "./adminreg.html"));
   }
   else{
   res.redirect("/a");
   }
   });
app.get("/c", (req, res) =>{
  res.sendFile(path.resolve(__dirname, "./client.html"))
});
app.get("/a", (req, res) =>{
  if(req.sessionID && req.session.userinfo){
     res.redirect("/adminreg");
  }
  res.sendFile(path.resolve(__dirname, "./adminlog.html"))
});
// Define a route to render the template
app.get('/t', (req, res) => {  

    const sql = 'SELECT * FROM Client';
    con.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Render the EJS template with the fetched data
        res.render('index', { clients: result });
    });
    
});

  app.get("/uploads/1.mp3",(req,res)=>{
    res.sendFile(__dirname+"/uploads/1.mp3")
})



server=app.listen(HTTP_PORT, () =>
  console.log("HTTP server listening at http://45.249.79.39:${HTTP_PORT}")
);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});