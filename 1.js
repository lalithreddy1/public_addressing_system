const express = require("express");
const path = require("path");
app = express();
app.set('view engine', 'ejs');
app.use("/js", express.static("js"));
app.use("/images", express.static("images"));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/broadcast.html"));
});
app.get("/b", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/broadcast2.html"));
});
app.listen(3000, () =>
  console.log("HTTP server listening at http://45.249.79.39:${HTTP_PORT}")
);
