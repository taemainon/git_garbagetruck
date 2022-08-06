const router = require("express").Router();
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')

router.use(cookieParser())
const authCheck = (req, res, next) => {
   //if not yet login
   if (!req.user) {
   }
   else {
      next();
   }
}

router.use(authCheck);
// Show profile page
router.get("/userinfo", (req, res) => {
   console.log(req.user)
   res.send(req.user)
})




module.exports = router;