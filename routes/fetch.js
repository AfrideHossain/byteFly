const express = require("express");
const router = express.Router();

const fetchValidUser = require('./middleware/fetchvaliduser');

const dbconfig = require('../dbcon');
const req = require("express/lib/request");
const res = require("express/lib/response");
let con = dbconfig.connection;

//fetch all user using get request
router.get('/fetchusers', fetchValidUser, async (req, res) => {
    let sql = "SELECT id, username, email FROM users";
    let success = true;
    try {
        con.query(sql, (err, result) => {
            if (err) console.log(err);
            if (result.length > 0) {
                res.json({ success, message: "Users found", result })
            } else {
                success = false;
                res.json({ success, message: "There is no users" })
            }
        })

    } catch (error) {
        res.status(500).send('Internal server error');
    }
})

//fetch single user info using get request
router.get('/singleuser', fetchValidUser, async (req, res) => {
    let sql = `SELECT id, username, email FROM users WHERE id = ${con.escape(req.query.uid)}`;
    let success = true;
    try {
        con.query(sql, (err, result) => {
            if (err) { console.log(err.message) }
            if (result.length > 0) {
                res.json({ success, message: "User's found", result })
            } else {
                success = false;
                res.json({ success, message: "User's not found" });
            }
        })
    } catch (error) {
        res.status(500).send('Internal server error');
    }
})
//fetch all messages of an user with sender and receiver id
router.get('/getmessages', fetchValidUser, async (req, res) => {
    let sql = `SELECT * FROM messages WHERE (sender_id = ${con.escape(req.query.sender)} AND receiver_id = ${con.escape(req.query.receiver)})
                                        OR (sender_id = ${con.escape(req.query.receiver)} AND receiver_id = ${con.escape(req.query.sender)})`;
    let success = true;
    try {
        con.query(sql, (err, result) => {
            if (err) { console.log(err.message) }
            if (result.length > 0) {
                res.json({ success, message: "Messages found", result })
            } else {
                success = false;
                res.json({ success, message: "Messages not found" });
            }
        })
    } catch (error) {
        res.status(500).send('Internal server error');
    }
})

//fetch all unread messages of an user with the user id
router.get('/getunreadmsg', fetchValidUser, async (req, res) => {
    let sql = `SELECT sender_id FROM messages WHERE receiver_id = ${con.escape(req.query.uid)} AND checked = 0`;
    let success = true;
    try {
        con.query(sql, (err, result) => {
            if (err) { console.log(err.message) }
            if (result.length > 0) {
                res.json({ success, message: "Unread Messages found", result })
            } else {
                success = false;
                res.json({ success, message: "Unread Messages not found" });
            }
        })
    } catch (error) {
        res.status(500).send('Internal server error');
    }
})

//fetch all unread messages of an user with the user id
router.put('/setreadmsg', fetchValidUser, async (req, res) => {
    let sql = `UPDATE messages SET checked = 1 WHERE (sender_id = ${con.escape(req.body.sender)} AND receiver_id = ${con.escape(req.body.uid)} AND checked = 0)`;
    let success = true;
    try {
        con.query(sql, (err) => {
            if (err) {
                success = false;
                res.json({ success, message: err.message })
            } else {
                res.json({ success, message: "Message readed" });
            }
        })
    } catch (error) {
        res.status(500).send('Internal server error');
    }
})

module.exports = router