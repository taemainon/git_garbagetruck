const jwt = require('jsonwebtoken')

function checkUser(req, res, next) {
  const token = req.signedCookies['mytoken']
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        //token is wrong
        console.log(err)
        res.status(400).send('Invalid token')
      } else {
        // OK, decoding is done
        req.decoded = decoded
        next()
      }
    })
  } else {
    //no token, return to homepage
    // res.redirect('/home');
    // console.log(token)
    res.render('login')
  }
}

module.exports = checkUser
