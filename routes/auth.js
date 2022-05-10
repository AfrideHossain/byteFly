const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'ThEByTeFlY';
const dbconfig = require('../dbcon');
let con = dbconfig.connection;

//ROUTE 1: Create new user using POST (/auth/createuser). No login required
router.post('/createuser', async (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    //let salt = await bcrypt.genSalt(10);
    //let password = await bcrypt.hash(req.body.password, salt);
    let password = md5(req.body.password);

    let success = true;
    try {
        con.query(`SELECT * FROM users WHERE username = ${con.escape(req.body.username
        )}`, (err, result) => {
            if (err) console.log(err);
            if (result.length > 0) {
                success = false;
                res.json({ success, message: "Username should be unique" });
            }
            else {
                let insertSql = `INSERT INTO users (username, email, password) VALUES (${con.escape(username)}, ${con.escape(email)}, ${con.escape(password)})`;
                con.query(insertSql, (err, result) => {
                    if (err) {
                        res.json({ err })
                    } else {
                        res.json({ success, message: "Account created successfully" })
                    }
                })
            }
        })

    } catch (error) {
        res.status(500).send("Internal server error");
    }
})


//ROUTE 2: Log in using POST (/auth/login).
router.post('/login', async (req, res) => {
    let username = req.body.username;

    let success = true;
    try {
        con.query(`SELECT * FROM users WHERE BINARY username = ${con.escape(username)}`, (err, result) => {
            //if (err) console.log(err);
            //console.log(result);
            if (result.length > 0) {
                let password = md5(req.body.password);
                if (password === result[0].password) {
                    let user = { id: result[0].id, username: result[0].username, email: result[0].email };
                    let data = { user }
                    let authToken = jwt.sign(data, JWT_SECRET);
                    res.json({ success, message: 'Login approved', user, authToken })
                } else {
                    success = false;
                    res.json({ success, message: 'Login denied' })
                }

            } else {
                success = false;
                res.json({ success, message: "please try again with correct credentials" });
            }
        })
    } catch (error) {
        res.status(500).send("Internal server error");
    }

})

// con.end();

module.exports = router