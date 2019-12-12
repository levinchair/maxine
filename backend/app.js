var express =  require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//const cors=require("cors");
var db = require("./model/db");
var router1= require("./router/cities");
var router2= require("./router/neighbourhood");
var router3= require("./router/geometry");
var router4= require("./router/view1");
var router5= require("./router/view2");
var router6= require("./router/view3");
var router7= require("./router/view4");
var router8= require("./router/OwnerConcentration");
var router9 = require("./router/viewOwners");
var router10 = require("./router/getMax");
var app = express();
var fs = require('fs');

mongoose.Promise = global.Promise;
/*
const mongo=mongoose.connect('mongodb://basic:chargerHPl1908w@18.223.172.169:27017/urbanNeighbourhood2',{ useNewUrlParser: true }
,(err,res)=>{
if(err) throw err;
console.log("Connected to database 2");
});
*/
console.log("Node is running");
//this is usign the json body parser. Look at Express Docs for more info. 
app.use(bodyParser.json()); // for parsing json
//extended allows for parsing url-encoded data using the qs library
// the body parser will only allow handlers that are 
app.use(bodyParser.urlencoded({extended: true, parameterLimit: 100}));  //for parsing application/x-www-form-urlencoded
// app.use(bodyParser.text());
//app.use(cors());
//another way of doing cross origin resource sharing
app.use((req,res,next)=>{ 
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,PUT,OPTIONS");
    next();
})
app.use("/",router1); 
app.use("/",router2);
app.use("/",router3);
app.use("/",router4); 
app.use("/",router5);
app.use("/",router6); 
app.use("/",router7);
app.use("/",router8);
app.use("/",router9);
app.use("/",router10);

//runs a script to generate prerendered files for cleveland. trying to make it ron server startup.
//var scriptSuccess = require("./scripts/prerendercities.js");
/*app.listen(3000,function(){
    console.log("Listning on 3000");
});*/

module.exports=app;

const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
//const port = process.env.PORT || 3000;
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
