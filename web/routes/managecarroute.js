const router = require('express').Router();
const config = require("../config/dbConfig.js");
const mysql = require("mysql");
const con = mysql.createConnection(config);
const checkUser = require('./middleware');

router.get("/newcars", checkUser, (req, res) => {
    const sql = "SELECT * FROM car";
    con.query(sql, function(err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("Database error");
            return;
        } else {
            res.render('newcar', { result: result })
        }
    });
})

router.post("/addcar", checkUser, (req, res) => {
    const { License_plate, seat, brand, color, info, type } = req.body;
    const sql = "INSERT INTO `car`(`License_plate`, `seat`,`brand`,`color`,`info`,`type`) VALUES (?,?,?,?,?,?)"
    con.query(sql, [License_plate, seat, brand, color, info, type], (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            const numrows = result.affectedRows;
            if (numrows != 1) {
                console.error("can not insert data");
                res.status(503).send("Database error");
            } else {
                res.send("/newcars");
            }

        }
    });
});

router.put("/updatecar", checkUser, (req, res) => {
    const { License_plate, seat, brand, color, car_id, info, type } = req.body;
    const sql = "UPDATE car SET License_plate=?,seat=?,brand=?,color=?,info=?,type=? WHERE car_id = ?"
    con.query(sql, [License_plate, seat, brand, color, info, type, car_id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send('/newcars');
        }
    });
});




// router.delete("/deletecar",checkUser,  (req, res) => {
//     const { car_id } = req.body;
//     console.log(car_id)
//     const sql = "DELETE FROM car WHERE car_id = ?"
//     con.query(sql, [car_id], (err, result) => {
//         if (err) {
//             console.log(err);
//             res.status(503).send("Server error");
//         } else {
//             res.status(200).send('/carinfo');
//         }
//     });
// });

module.exports = router;