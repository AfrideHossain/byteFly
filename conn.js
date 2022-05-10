const dbconfig = require('./dbcon');
let con = dbconfig.connection;
con.connect((err) => {
    if (err) {
        console.log(err.stack);
    }
})
