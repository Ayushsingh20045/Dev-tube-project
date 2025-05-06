//Register module alias for cleaner import paths
require("module-alias/register");

//Import required modules
const http = require('http');
const path = require('path');
const passport = require('./config');  //import configure passport
const session = require('express-session');
const express = require('express');
const socketio = require('socket.io');

//Create an express app

 const app = express();

 //Create an http server

 const server = http.createServer(app);

 //Attach socket.oi to the http server

 const io = socketio(server);

 //Export io and app for use in other modules

 module.exports = {io,app};

 //Socket.io connection handler

 io.on("connection",(socket)=>{
    console.info("A client connected")
 });

//Import application routes

const routes = require("./routes");

//Initialize database connection
require("@lib/db");

//Import custom middleware to check DB connection

const {checkDBConnection} = require("@lib/middlewares")

//import channel model

const channel = require("@models/channel")

//middleware setup
//set the directory for view template

// app.set("views",path.join(__dirname, 'views'));

//set the view engine to ejs

app.set("view engine","ejs");

//serve static files from the public directory
app.use(express.static("public"));

//parse JSON request bodies
app.use(express.json());

//parse url-encoded request bodies
app.use(express.urlencoded({extended:true}));

//setup session management with a secret key
app.use(session({secret:"secret",resave:false,saveUninitialized:false}));

//Initialize passport for authentication
app.use(passport.initialize());

//Enable persistent login sessions
app.use(passport.session());

//custom middleware to check db connection
app.use(checkDBConnection);

//middleware to attach user data to res.locals for views

app.use(async(req,res,next)=>{

   res.locals.isCreateChannel = false;
   if(req.user){
      res.locals.channel=req.channel=req.user;
   }
   else{
      req.channel = res.locals.channel=null;
   }
   next();
});

//use application routes

app.use("/",checkDBConnection,routes);

//404 handeler for unknown routes
app.use((req,res)=>{
   res.status(404).render("404");
});

//set the port for the server
const port = 3000;

//start the server and listen on the specified port
server.listen(port,()=>{
   console.info(`server started at http://localhost:${port}`);
});