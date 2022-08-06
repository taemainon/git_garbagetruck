const router = require('express').Router()
const passport = require('passport')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const config = require('../config/dbConfig')
const con = mysql.createConnection(config)

//login using Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
)

//if login success, redirect here
router.get('/homepage', (req, res) => {
  res.redirect('/mapping')
})

//log out
router.get('/logout', (req, res) => {
  req.logOut()
  // var removing = browser.cookies.remove()
  res.clearCookie('mytoken')

  res.redirect('/')
})

module.exports = router
