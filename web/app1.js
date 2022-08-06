require('dotenv').config();
const express = require("express");

const path = require("path");
const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const config = require("./config/dbConfig.js");
const multer = require("multer");
const bodyParser = require("body-parser");

const fs = require('fs');
const http = require('http');
const https = require('https');


const app = express();
const con = mysql.createConnection(config);
const passportSetup = require("./config/passport-setup");
const passport = require("passport");
const authRoutes = require("./routes/auth-routes");
const profile = require("./routes/profile-routes")
const pageRoute = require('./routes/pagerout');
const compression = require('compression');
const blogRoute = require('./routes/manageuserroute');
const caroute = require('./routes/managecarroute');
const carmatchro = require('./routes/managecarmatch');
const reqdata = require('./routes/managereqdata');
const dash = require('./routes/managedashboard');
// const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://broker.emqx.io')
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const { decode } = require("punycode");

const privateKey = fs.readFileSync('/etc/letsencrypt/live/pytransit.szo.me/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/pytransit.szo.me/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/pytransit.szo.me/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

app.use(bodyParser.urlencoded({ extended: true })); //when you post service
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(compression());
app.use(cookieSession({
        maxAge: 60 * 60 * 1000,
        keys: [process.env.cookiekey]
    }))
    // app.use(helmet());      //for header protection
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/style", express.static(path.join(__dirname, '/public/styles')));
app.use(passport.session());
app.use(cookieParser(process.env.COOKIE_KEY));
app.use("/auth", authRoutes);
app.use(carmatchro)
app.use(pageRoute);
app.use(blogRoute);
app.use(caroute);
app.use(reqdata);
app.use(dash);

app.use("/profileroute", profile);

app.set('view engine', 'ejs');

// app.engine('html', require('ejs').renderFile);

app.use("/image", express.static(path.join(__dirname, 'image')));

app.post("/signUp", function(req, res) {

    const username = req.body.username;
    const email = req.body.email;
    const tel = req.body.tel;
    const role = req.body.role

    const sql = "INSERT INTO user(name, email, role,tel) VALUES(?,?,?,?)";
    con.query(sql, [username, email, role, tel], function(err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("Database error");
            return;
        }
        // get inserted rows
        const numrows = result.affectedRows;
        if (numrows != 1) {
            console.error("can not insert data");
            res.status(503).send("Database error");
        } else {
            res.send("Registered");
        }
    });

});

app.get('/verify', (req, res) => {
    const token = req.signedCookies['mytoken'] || req.headers['x-access-token'];
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            res.status(400).send('Invalid token');
        } else {
            // OK, decoding is done
            console.log(decoded)
            res.send(decoded);
        }
    });
});

//-------------------------- Register ------------------------


app.post("/loginmoblie", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const sql = "SELECT * FROM driver LEFT JOIN car_match on driver.driver_id = car_match.driver_id WHERE driver.username =? AND DATE(car_match.date) = DATE(CURRENT_TIMESTAMP()) AND role=2;";

    con.query(sql, [username], function(err, result, fields) {
        if (err) {
            res.status(500).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            const numrows = result.length;

            if (numrows != 1) {
                res.status(401).send("เข้าสู่ระบบไม่สำเร็จ");
            } else {
                bcrypt.compare(password, result[0].password, function(err, resp) {
                    if (err) {
                        console.log(err);
                        res.status(503).send("การรับรองเซิร์ฟเวอร์ผิดพลาด");

                    } else if (resp == true) {
                        console.log(result);
                        res.send(result);
                    } else {
                        //wrong password
                        res.status(403).send("รหัสไม่ถูกต้อง");
                    }
                });
            }
        }
    });
});


app.get("/query_location", (req, res) => {

    const sql = "SELECT * FROM `user_request`"
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.send(result);
        }
    });
});

app.post("/query_point", (req, res) => {

    const _id = req.body.driver_id;
    const sql = "SELECT * FROM `review_driver` WHERE driver_id=?"
    con.query(sql, [_id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.send(result);
        }
    });
});

app.post("/date", (req, res) => {

    const _id = req.body.carmatch;
    const sql = "SELECT  DATE_FORMAT(str_date,'%Y-%m-%d') FROM `driver`LEFT JOIN car_match on driver.driver_id = car_match.driver_id WHERE carmatch=?"
    con.query(sql, [_id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.send(result);
        }
    });
});

app.put("/setstatus", (req, res) => {
    const { request_id } = req.body;
    const { res_driver } = req.body;
    const sql = "UPDATE `user_request` SET `status` = '0',`res_date` =CURRENT_TIMESTAMP(),`res_driver` =? WHERE `user_request`.`request_id` = ?"
    con.query(sql, [res_driver, request_id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send("Update Successfully");
        }
    });
});

app.put("/res_date", (req, res) => {
    const { request_id } = req.body;
    const sql = "UPDATE `user_request` SET `res_date` =CURRENT_TIMESTAMP() WHERE `user_request`.`request_id` = ?"
    con.query(sql, [request_id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send("Update Successfully");
        }
    });
});


app.post("/addlocation", (req, res) => {
    const { carmatch, lat, lng } = req.body;
    console.log(req.body)
    const sql = "INSERT INTO location(carmatch, lat, lng) VALUES (?,?,?)"
    con.query(sql, [carmatch, lat, lng], (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send("addlocationsuccessed");
        }
    });
});


app.post("/review", (req, res) => {
    const { driver_id, user_email, user_name, point, report } = req.body;
    const sql = "INSERT INTO  review_driver( driver_id, user_email,user_name,point,report) VALUES (?,?,?,?,?)"
    con.query(sql, [driver_id, user_email, user_name, point, report], (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send("reviewsuccessed");
        }
    });
});

app.post("/request", (req, res) => {
    const { user_email, user_name, lat, lng, route } = req.body;
    const sql = "INSERT INTO user_request( user_email, user_name,lat, lng,  route) VALUES (?,?,?,?,?)"
    const sql1 = "INSERT INTO user_info( email, name) VALUES (?,?)"
    con.query(sql, [user_email, user_name, lat, lng, route], (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            console.log(result.insertId)
            let num = (result.insertId).toString()
            con.query(sql1, [user_email, user_name], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(503).send("Server error");
                } else {
                    res.send(num);
                }
            });

        }
    });
});

app.get("/showrequest", (req, res) => {
    const sql = "SELECT * FROM `user_request`"
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send(result);
        }
    });
});
app.get("/count_in", (req, res) => {
    const sql = "SELECT COUNT(request_id) FROM `user_request` WHERE (status = 1 AND route =1)"
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send(result);
        }
    });
});
app.get("/count_out", (req, res) => {
    const sql = "SELECT COUNT(request_id) FROM `user_request` WHERE (status = 1 AND route =0)"
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send(result);
        }
    });
});

app.post("/selectcar", function(req, res) {
    const id = req.body.carmatch;
    const sql = "SELECT * FROM car LEFT JOIN car_match on car.car_id = car_match.car_id WHERE car_match.carmatch =?";
    con.query(sql, [id], function(err, result, fields) {
        if (err) {
            res.status(500).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.status(200).send(result);
        }

    });
});

app.post("/requestinfo", (req, res) => {
    const requestdata = req.body.requestdata;
    const sql = "SELECT * FROM user_request where request_id = ?";
    con.query(sql, [requestdata], function(err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("Database error");
            return;
        } else {
            res.status(200).send(result);
        }
    });
})


app.get("/reqdata", (req, res) => {
    const sql = "SELECT * FROM `user_request` LEFT JOIN driver ON driver.driver_id = user_request.res_driver"
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(503).send("Server error");
        } else {
            res.status(200).send(result);
        }
    });
});

app.post("/hist", function(req, res) {
    const id = req.body.driver_id;
    const sql = "SELECT DATE_FORMAT(date,'%d/%m/%Y') as date ,License_plate,brand,color FROM `car_match` LEFT JOIN `car` ON `car_match`.`car_id` = `car`.`car_id` WHERE MONTH(`date`) = MONTH(CURRENT_TIMESTAMP) AND `driver_id` = ? ORDER BY date desc;";
    con.query(sql, [id], function(err, result) {
        if (err) {
            res.status(500).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.status(200).send(result);
        }

    });
});

client.on('connect', function() {
    client.subscribe('moyanyo', function(err) {
        if (!err) {
            client.publish('moyanyo', 'Hello mqtt')
        }
    })
})

client.on('message', function(topic, message) {
    // message is Buffer
    //console.log(message.toString())
    // client.end()
})

const PORT = 80

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT} `);
});

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

// app.listen(PORT, function() {
//     console.log("Server is running at " + PORT);
// });

const wss = new WebSocket.Server({ server: httpsServer });
wss.on('connection', function connection(ws) { // สร้าง connection
    ws.on('message', function incoming(message) {
        // รอรับ data อะไรก็ตาม ที่มาจาก client แบบตลอดเวลา
        console.log('received: %s', message);
    });
    ws.on('close', function close() {
        // จะทำงานเมื่อปิด Connection ในตัวอย่างคือ ปิด Browser
        console.log('disconnected');
    });

    // ส่ง data ไปที่ client เชื่อมกับ websocket server นี้
    client.on('message', function(topic, message) {
        // message is Buffer
        console.log(message.toString())
        ws.send(message.toString());
        // client.end()
    })

});