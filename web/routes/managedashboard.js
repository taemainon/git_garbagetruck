const router = require('express').Router();
const config = require("../config/dbConfig.js");
const mysql = require("mysql");
const con = mysql.createConnection(config);
const checkUser = require('./middleware');


router.get("/newdashboard", checkUser, (req, res) => {
    const sql = "SELECT driver.name,driver.lastname,COUNT(request_id) AS num_req ,driver.tell,driver.sex,driver.email FROM `user_request` LEFT JOIN driver ON driver.driver_id = user_request.res_driver WHERE user_request.status = 0 GROUP BY`res_driver` ORDER BY COUNT(request_id) DESC LIMIT 5";
    con.query(sql, function(err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("Database error");
            return;
        } else {
            const sql1 = "SELECT driver.name,driver.lastname,driver.tell,driver.email,driver.sex ,CAST((SUM(point)/COUNT(review_id))AS decimal(18,2))as score,COUNT(review_id) as num FROM `review_driver`LEFT JOIN driver ON driver.driver_id = review_driver.driver_id GROUP BY review_driver.driver_id  ORDER BY (score) desc LIMIT 5";
            con.query(sql1, function(err, result1, fields) {
                if (err) {
                    console.error(err.message);
                    res.status(503).send("Database error");
                    return;
                } else {
                    res.render('newdashboard', { resule1: result1, resule: result })
                }
            });
        }
    });
})


module.exports = router;