const mongoose = require("mongoose");
const multer = require("multer");
const ImageKit = require('imagekit');
const axios = require('axios');

//mongodb connection url from environment variable

const url = process.env.MONGODB_URI;

//connect to mongoDB using mongoose

mongoose.connect(url,{
    
    useFindAndModify:false,
    useCreateIndex:true,
})
.then(()=>console.info("Connected to mongodb"))
.catch((error)=>console.error("Error connecting to mongodb:",error));

//create a new connection to mongodb
const conn = mongoose.createConnection(url);

//initialize Imagekit with credentials from environment variables

const imagekit = new ImageKit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

//BunnyCDN endpoint for video streaming
const bunnyStreamEndpoint =  `https://video.bunnycdn.com/library/${process.env.BUNNY_STREAM_LIBRARY_ID}/videos`;

//function to create a video entry in bunnycdn
const createVideoEntry = async(fileName)=>{
    const response = await axios.post(
        bunnyStreamEndpoint,
        {title:fileName},
        {
            headers:{
                AccessKey:process.env.BUNNY_STREAM_API_KEY,
                "Content-Type":"application/json",
            },
        }
    );
    return response.data.guid;
};

//configure multer for handling file uploads in memory

const storage = multer.memoryStorage();
const upload = multer({ storage });

//Export the configured modules and functions

module.exports = {
    conn,
    upload,
    imagekit,
    createVideoEntry,
    bunnyStreamEndpoint
};