const passport = require('passport');
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Channel = require("@models/Channel");
const {createUniqueHandle}= require("@lib/utils");

//configure the Google strategy for use by passport

passport.use(
    new GoogleStrategy(
        {
            clientID: 'YOUR_GOOGLE_CLIENT_ID',
            clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
            callbackURL: '/api/auth/google/callback'
        },
        async(accessToken,refreshToken,profile,cb)=>{
            try{
                //find channel by email
                let channel = await Channel.findOne({email:profile.emails[0].value});

                //if no channel is found,create a new one
                if(!channel){
                    //find handles with the same base name as the email username and if found make it unique.

                    const handle = await createUniqueHandle(profile.emails[0].value.split("@")[0]);

                    channel = await Channel.create({
                        name:profile.displayName,
                        handle:handle,
                        email:profile.emails[0].value,
                        logoURL:profile.photos[0].value.split("=")[0]
                    });
                };

                //Return the channel through the callback
                cb(null,channel);


            } catch(err){
                //handle errors

                cb(err);
            }
        }
    )
);

//Serialize the user to decide which data of the user object should be stored in the session.
passport.serializeUser((channel,done)=>{
    done(null,channel.id); //stores the channel id in the session
});

passport.deserializeUser(async(id,done)=>{
    try{
        //find the channel by id
        const channel = await Channel.findById(id);
        done(null,channel); //return the channel
    }catch(err){
        done(err)
    }
});

module.exports=passport;