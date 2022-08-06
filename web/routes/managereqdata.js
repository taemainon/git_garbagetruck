const router = require('express').Router();
const config = require("../config/dbConfig.js");
const mysql = require("mysql");
const con = mysql.createConnection(config);
const checkUser = require('./middleware');


router.get("/newrequdata", checkUser, (req, res) => {
    const sql = "SELECT user_request.user_email as em,route,DATE_FORMAT(req_date,'%d-%m-%Y %r') as req,DATE_FORMAT(res_date,'%d-%m-%Y %r') as res,driver.name AS name,driver.name as last FROM `user_request` LEFT JOIN driver ON driver.driver_id = user_request.res_driver WHERE MONTH(req_date)=MONTH(CURRENT_TIMESTAMP) ORDER BY `req_date` DESC";
    con.query(sql, function(err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("Database error");
            return;
        } else {
            res.render('newrequdata', { resule: result })
        }
    });
})

router.get("/graph_reqdata", (req, res) => {
    const sql = "SELECT MONTH(`req_date`)as _month,COUNT(`request_id`)as num FROM `user_request`WHERE YEAR(`req_date`)= YEAR(CURRENT_TIMESTAMP) GROUP BY MONTH(`req_date`)"
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send(result);
        }
    });
});

router.get("/graph_reqdata_week", (req, res) => {
    const sql = "SELECT WEEKDAY(`req_date`)as _day,COUNT(`request_id`)as num FROM `user_request`WHERE WEEK(`req_date`,1)= WEEK(CURDATE(),1) GROUP BY WEEKDAY(`req_date`)"
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send(result);
        }
    });
});


module.exports = router;