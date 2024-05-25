const express=require("express");
const app=express();
const path = require("path");
const fs = require("fs");
const express = require("express");
const WebSocket = require("ws");
const FileApi=require("file-api");
const Fs = require('fs').promises;
const FileReader=require("filereader");
const schedule=require("node-schedule");
const multer = require('multer');
const app = express();
const upload = multer({ dest: 'uploads/' });
const WS_PORT = process.env.WS_PORT || 8888;// hop by hop
const HTTP_PORT = 8000 ;//end to end 
const schedule1=0;
const {exec}= require("child_process");
File = FileApi.File;
const schedules=[];
var flag=0;
var flag_scheduled_song=0;
var storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null,req.body.name );//Appending .jpg
    }
  });
  var uploads1 = multer({ storage: storage1 });






  function wavsave(req,res,result){
    uploads1(req,res,(err)=>{
        if(err){
        console.log(err);
        }
        else{
            const soundFilePath = req.file.path;
            const waveName=req.body.name;
            const Name=waveName.split(".")[0];
            console.log("query")
             exec(`ffmpeg -i ${req.file.path} -acodec pcm_s16le  -ac 1 -ar 16000 uploads/${Name}.wav`,(err,std=>{
            if(err){
                console.log(err)
            }
            else{
                res.download("1.wav",()=>{
                    console.log("File is downloaded");
                    
        var file = new File("uploads/"+Name+".wav");
        const reader = new FileReader();
        var flag1=result;
        reader.onload = async(event) => {
            const arrayBuffer = event.target.result;
            const chunkSize = 2972; // Adjust chunk size as needed
            let offset = 0;
            let i=0;
            while (offset < arrayBuffer.byteLength) {
                if(flag==1){
            deleteFile("uploads/"+Name+".wav");
                  break;
                }
                const chunk = arrayBuffer.slice(offset, offset + chunkSize); 
                
                connectedClients.forEach((ws,i)=>{ 
                ws.send(chunk);
                })
                offset += chunkSize;
                if(arrayBuffer.byteLength - offset<=20){updateStatus('0'); flag1=0;}
                if(flag1==0){
                    deleteFile("uploads/"+Name+".wav");
                return;}
                
               await new Promise(resolve => setTimeout(resolve,70));
            }
            deleteFile("uploads/"+Name+".wav");
        };
        reader.readAsArrayBuffer(file);
                    
                    
                    
                    
                });
            }
           }))
        }
    })
}

function playScheduledMusic(req,res,result,loc){

    var file = new File("uploads/"+loc+'.wav');
            const reader = new FileReader();
            var flag1=result;
            reader.onload = async(event) => {
                const arrayBuffer = event.target.result;
                const chunkSize = 2972; // Adjust chunk size as needed
                let offset = 0;
                let i=0;
                while (offset < arrayBuffer.byteLength) {
                    if(flag==1){
                      break;
                    }
                    const chunk = arrayBuffer.slice(offset, offset + chunkSize); 
                    
                    connectedClients.forEach((ws,i)=>{ 
                    ws.send(chunk);
                    })
                    offset += chunkSize;
                    if(arrayBuffer.byteLength - offset<=20){updateStatus('0'); flag1=0;}
                    if(flag1==0){
                    return;}
                    
                   await new Promise(resolve => setTimeout(resolve,70));
                }
            };
            reader.readAsArrayBuffer(file);
      
    }







  app.post("/upload", uploads1.single("mp3File"), (req, res) => {

    const action=req.body.action;
    if(action=="Play Now" && flag_scheduled_song==0){
        exec(`ffmpeg -i ${req.file.path} -acodec pcm_s16le  -ac 1 -ar 16000 uploads/${Name}.wav`,(err,std)=>{
            if(err){
                console.log(err)
            }
            else{
                res.download("1.wav",()=>{
                    console.log("File is downloaded");
                    deleteFile("./uploads/"+Name+".mp3");
                    con.query(`select flag from broadcast`,function(err,result){
                        if(err)console.log(err);
                        console.log("result");
                        console.log(result[0].flag);
                        if(result[0].flag==0){
                        con.query(`update broadcast SET flag='1'`,function(err,result){
                            if(err) throw err;
                            console.log(result);
                          });
                        wavsave(req,res,1,Name)
                        }
                        });
                        con.query(`update broadcast SET flag='0'`,function(err,result){
                            if(err) throw err;
                          });
                });
            }
        }
        )};
        else{
            flag_scheduled_song=1;
            const alarmTime = req.body.alarmTime;
            const days = JSON.parse(req.body.days);
            const soundFilePath = req.file.path;
            const waveName=req.body.name;
            const Name=waveName.split(".")[0];
            console.log(Name)
    exec(`ffmpeg -i ${req.file.path} -acodec pcm_s16le  -ac 1 -ar 16000 uploads/${Name}.wav`,(err,std)=>{
        if(err){
            console.log(err)
        }
        else{
            res.download("1.wav",()=>{
                console.log("File is downloaded");
                deleteFile("./uploads/"+Name+".mp3");
                
            });
        }
    });
    // Schedule alarm
    days.forEach(day => {
        const songName=Name;
        const [hours, minutes] = alarmTime.split(":").map(Number);
        endMin=(parseInt(minutes)+5)%60;
        t=parseInt((parseInt(minutes)+5)/60);
        endHour=(parseInt(hours+t))
        console.log(schedules);
        for(let i=0;i<schedules.length;i++){
            if((schedules[i][0][0]==hours||schedules[i][1][0]==hours) && ((schedules[i][0][1]>=minutes &&schedules[i][0][1]<=endMin)||( schedules[i][1][1]<=endMin&&schedules[i][1][1]>=minutes))&&schedules[i][0][2]==day ){
                           con.query(`update broadcast SET flag='0'`,function(err,result){
            if(err) throw err;
          console.log(result);
          });
                res.status(401).send("aldready exists");
            }
        }
        schedules.push([[hours,minutes,day],[endHour,endMin]]);
 
        const rule = new schedule.RecurrenceRule();
        rule.dayOfWeek = day; // Set the day of the week for the alarm
        rule.hour = hours;
        rule.minute = minutes;
        const ruleName=songName

        schedule.scheduleJob(ruleName,rule, () => {
            console.log("musicScheduled");
            const songPath = path.join(__dirname, "uploads", ruleName+".wav"); // Assuming songName is the file name
            console.log(songPath);
            console.log(`Alarm triggered at ${hours}:${minutes}`);
            con.query(`select flag from broadcast`,function(err,result){
            if(err)console.log(err);
            if(result[0].flag==0){
               con.query(`update broadcast SET flag='1'`,function(err,result){
            if(err) throw err;
          console.log(result);
          });
          }
          });
        playScheduledMusic(req,res,1,ruleName);
        flag_scheduled_song=0;
        con.query(`update broadcast SET flag='0'`,function(err,result){
            if(err) throw err;
          console.log(result);
          });
        });
   
});
 res.json({ message: "Alarm set successfully" });
        }
    }
    
    
    
    
    
    
    
    const alarmTime = req.body.alarmTime;
        const days = JSON.parse(req.body.days);
        const soundFilePath = req.file.path;
        const waveName=req.body.name;
        const Name=waveName.split(".")[0];
        console.log(Name)
        exec(`ffmpeg -i ${req.file.path} -acodec pcm_s16le  -ac 1 -ar 16000 uploads/${Name}.wav`,(err,std)=>{
            if(err){
                console.log(err)
            }
            else{
                res.download("1.wav",()=>{
                    console.log("File is downloaded");
                    deleteFile("./uploads/"+Name+".mp3");
                    
                });
            }
        });
        // Schedule alarm
        days.forEach(day => {
            const songName=Name;
            const [hours, minutes] = alarmTime.split(":").map(Number);
            endMin=(parseInt(minutes)+5)%60;
            t=parseInt((parseInt(minutes)+5)/60);
            endHour=(parseInt(hours+t))
            console.log(schedules);
            for(let i=0;i<schedules.length;i++){
                if((schedules[i][0][0]==hours||schedules[i][1][0]==hours) && ((schedules[i][0][1]>=minutes &&schedules[i][0][1]<=endMin)||( schedules[i][1][1]<=endMin&&schedules[i][1][1]>=minutes))&&schedules[i][0][2]==day ){
                               con.query(`update broadcast SET flag='0'`,function(err,result){
                if(err) throw err;
              console.log(result);
              });
                    res.status(401).send("aldready exists");
                }
            }
            schedules.push([[hours,minutes,day],[endHour,endMin]]);
     
            const rule = new schedule.RecurrenceRule();
            rule.dayOfWeek = day; // Set the day of the week for the alarm
            rule.hour = hours;
            rule.minute = minutes;
            const ruleName=songName
            //write data to database
            schedule.scheduleJob(ruleName,rule, () => {
                console.log("musicScheduled");
                const songPath = path.join(__dirname, "uploads", ruleName+".wav"); // Assuming songName is the file name
                console.log(songPath);
                console.log(`Alarm triggered at ${hours}:${minutes}`);
                con.query(`select flag from broadcast`,function(err,result){
                if(err)console.log(err);
                if(result[0].flag==0){
                   con.query(`update broadcast SET flag='1'`,function(err,result){
                if(err) throw err;
              console.log(result);
              });
              }
              });
            playScheduledMusic(req,res,1,ruleName);
            con.query(`update broadcast SET flag='0'`,function(err,result){
                if(err) throw err;
              console.log(result);
              });
                
            });
       
    });
     res.json({ message: "Alarm set successfully" });
    
    );
    



app.get("/sc",(req,res)=>{
    res.sendFile(__dirname+"/schedule.html");
})
app.listen(3000);