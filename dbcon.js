const mysql = require('mysql');

// config = {
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "bytefly"
// }
config = {
    host: "sql.freedb.tech",
    user: "freedb_bytefly",
    password: "Vq22z@fgz$8@tGR",
    database: "freedb_bytefly"
}

let connection = mysql.createConnection(config);
connection.connect((err) => {
    if (err) {
        console.log("Error connecting: " + err.stack)
    } else {
        console.log("Successfully connected to the database");
    }
});

module.exports = {
    connection: mysql.createConnection(config)
}