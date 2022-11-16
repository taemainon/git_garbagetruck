const router = require('express').Router();
const config = require("../config/dbConfig.js");
const mysql = require("mysql");
const con = mysql.createConnection(config);
const checkUser = require('./middleware');

router.get("/newcarmatch", checkUser, (req, res) => {
    const sql = "SELECT * FROM car_match,driver,car WHERE DATE(date)=DATE(CURRENT_TIMESTAMP) AND car_match.driver_id =driver.driver_id AND car_match.car_id = car.car_id ORDER BY date DESC";
    con.query(sql, function(err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("Database error");
            return;
        } else {
            res.render('newmatch', { resule: result })
        }
    });
})

router.delete("/deletecarmatch", checkUser, (req, res) => {
    const { carmatch } = req.body;
    const sql = "DELETE FROM car_match WHERE carmatch = ?"
    con.query(sql, [carmatch], (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send("/newcarmatch");
        }
    });
});

router.put("/updatecarmatch", checkUser, (req, res) => {
    const { name, lastname, License_plate, carmatch } = req.body;
    const sql = "UPDATE car_match SET driver_id=(SELECT driver_id FROM driver WHERE name =? AND lastname=? ),car_id=(SELECT car_id FROM car WHERE License_plate = ?) WHERE carmatch=?"
    con.query(sql, [name, lastname, License_plate, carmatch], (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send("/newcarmatch");
        }
    });
});

router.post("/addcarmatch", checkUser, (req, res) => {
    const data = req.body;
    
    var sql = `INSERT INTO car_match (driver_id, car_id) VALUES (${data.driver_id}, ${data.car_id})`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send({
            message: "success"
        });
    });

});

router.get("/graph_carmatch", (req, res) => {
    const sql = "SELECT MONTH(`date`)as _month,COUNT(`carmatch`) as num FROM `car_match`WHERE YEAR(`date`)= YEAR(CURRENT_TIMESTAMP) GROUP BY MONTH(`date`)"
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send(result);
        }
    });
});

router.get("/graph_carmatch_week", (req, res) => {
    const sql = "SELECT WEEKDAY(`date`)as wun,COUNT(`carmatch`) as num FROM `car_match`WHERE WEEK(`date`,1)=WEEK(CURDATE(),1) GROUP BY WEEKDAY(`date`)"
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send(result);
        }
    });
});

router.get("/namelastname", checkUser, (req, res) => {
    const sql = "SELECT driver_id, name, lastname FROM driver  WHERE role =2";
    con.query(sql, function(err, result4, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("Database error");
            return;
        } else {
            res.send(result4)
        }
    });
})

router.get("/license_plate", (req, res) => {
    const sql = "SELECT * FROM `car` ";
    con.query(sql, function(err, result4, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("Database error");
            return;
        } else {
            res.send(result4)
        }
    });
})

router.get("/showweigh", (req, res) => {
    const sql = "SELECT b.type, DATE_FORMAT(a.date,'%Y-%m-%d') as date , SUM(a.weight) from trash a left join car b on a.car_id = b.car_id group by b.type, CAST(a.date AS DATE)";
    con.query(sql, function(err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("Database error2");
            return;
        } else {
            res.render('showweigh', { result: result })
        }
    });
})

router.get("/statisticweigh", (req, res) => {
    const sql = "SELECT b.type, DATE_FORMAT(a.date,'%Y-%m-%d') as date , SUM(a.weight) from trash a left join car b on a.car_id = b.car_id group by b.type, CAST(a.date AS DATE)";
    con.query(sql, function(err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("Database error3");
            return;
        } else {
            res.render('showweigh', { result: result })
        }
    });
})




module.exports = router;

router.get("/newcarmatch", checkUser, (req, res) => {
    const sql = "SELECT * FROM car_match,driver,car WHERE DATE(date)=DATE(CURRENT_TIMESTAMP) AND car_match.driver_id =driver.driver_id AND car_match.car_id = car.car_id ORDER BY date DESC";
    con.query(sql, function(err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("Database error");
            return;
        } else {
            res.render('newmatch', { resule: result })
        }
    });
})


router.post("/findCarMatchById", (req, res) => {
    var data = req.body

    var sql = `SELECT * FROM car_match WHERE car_match.carmatch = ${data.match_id}`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send({
            result: result
        });
    });
})