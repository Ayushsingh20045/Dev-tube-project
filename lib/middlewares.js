const { promiseImpl } = require('ejs');
const mongoose=require('mongoose');

//middleware to check the database connection
const checkDBConnection = (req,res,next)=>{
    if(mongoose.connection.readyState !== 1){
        return res.status(500).json({message:'Database connection error'});
    }
    next();
};

//middleware to check if a channel is created
const checkChannel =(req,res,next)=>{
    if(!req.channel?.uid){
        res.redirect('/channel/create');
    }else{
        next();
    }
}

//middleware to check id a user is loggedin 
const isloggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/')
    }
};

//utility function to handle async errors in middleware

const asyncHandler=(fn)=>{
    return function(req,res,next){
        return promise
        .resolve(fn(req,res,next))
        .catch(next);
    }
}
module.exports={
    checkChannel,
    isloggedIn,
    asyncHandler,
    checkDBConnection
};