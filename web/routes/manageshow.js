const router = require('express').Router();
const config = require("../config/dbConfig.js");
const mysql = require("mysql");
const con = mysql.createConnection(config);
const checkUser = require('./middleware');


router.get("/showweigh", checkUser, (req, res) => {
    const sql = "SELECT b.type, a.date , SUM(a.weight) from trash a left join car b on a.car_id = b.car_id group by b.type, CAST(a.date AS DATE)"
    con.query(sql, function(err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("Database error1");
            return;
        } else {
            res.render('showweigh', { resule: result })
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