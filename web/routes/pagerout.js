const router = require('express').Router()
var mqtt = require('mqtt')
const checkUser = require('./middleware')
const jwt = require('jsonwebtoken')
    //  router.use(checkUser);

var client = mqtt.connect('mqtt://broker.emqx.io')

router.get('/login', (req, res) => {
    const token = req.signedCookies['mytoken']
    if (token) {
        res.redirect("/newadmianse")
    } else {
        res.render('login')
    }
})

router.get('/forgotpassword', (req, res) => {
    const token = req.signedCookies['mytoken']
    if (token) {
        res.redirect("/newadminse")
    } else {
        res.render('forgotpwd')
    }
})

router.get('/', (req, res) => {
    res.render('home')
})

router.get('/mapping', (req, res) => {
    client.on('connect', function() {
        client.subscribe('moyanyo', function(err) {
            if (!err) {
                client.publish('moyanyo', 'Hello mqtt')
            }
        })
    })

    client.on('message', function(topic, message) {
        // message is Buffer
        console.log(message.toString())
            // client.end()
    })
    res.render('index')
})


module.exports = router