const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const key = require("./key")
const mysql = require("mysql");
const config = require("./dbConfig");
const con = mysql.createConnection(config);
// const checkDB="";

passport.serializeUser((user, done) => {
    // console.log(user)
    done(null, user);
})

passport.deserializeUser((id, done) => {
    //TODO: generally, you must query for id in DB
    // done(null, id);
    console.log(id);
    const sql ='SELECT * from user WHERE email = ? '
    con.query(sql,[id.email], function (err, result) {
        if (err) {
            return done(err)
        }
        else {
            userINFO={name:id.name,email:id.email,photo:id.photo}
            console.log(userINFO)
            done(null, userINFO);
            // console.log(result.length)
            // if (result.length == 1) {
            //     // console.log(result)
                
                
            // }
            // else {
            //     console.log('set False')
            //     return done(null, 'Nodata')
            // }
        }

    });

})


passport.use(
    new GoogleStrategy(
        {
            clientID: key.google.clientID,
            clientSecret: key.google.clientSecret,
            callbackURL: "/auth/google/redirect"
        },
        (accessToken, refreshToken, profile, done) => {

            const user = { name: profile.displayName, email: profile.emails[0].value, photo: profile.photos[0].value };

            done(null, user)

        })
);