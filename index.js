const express = require("express");
const path = require("path");
app = express();
const filereader=require("filereader")

const multer = require('multer');
const {exec}= require("child_process");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');// Directory where uploaded files will be saved
  },
  filename: function (req, file, cb) {    
      cb(null, +path.resolve("1.mp3"));// Unique filename
  }
});
const upload = multer({ storage: storage });
app.set('view engine', 'ejs');
app.use("/js", express.static("js"));
app.use("/images", express.static("images"));
app.use(express.static("public"));
app.post("/upload",upload.single("file"),(req,res)=>{
  res.send('File uploaded successfully');
})
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/broadcast.html"));
});
app.get("/b", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/broadcast2.html"));
});
app.get("/s", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/schedule.html"));
});
app.get("/s2", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/Schedule2.html"));
});
app.get("/s3", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/schedule3.html"));
});
app.listen(3000, () =>
  console.log("HTTP server listening at http://45.249.79.39:${HTTP_PORT}")
);
