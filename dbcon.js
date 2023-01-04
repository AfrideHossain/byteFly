const mysql = require('mysql');

// config = {
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "bytefly"
// }
config = {
    host: "fdb29.awardspace.net",
    user: "4237775_bytefly",
    password: "T2)Ey6.-7AF5JVW!",
    database: "4237775_bytefly"
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
