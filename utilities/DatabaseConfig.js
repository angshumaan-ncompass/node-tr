
const mysql = require('mysql2');



// create the connection to database
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

connection.getConnection((err) => {
    if (!err) {
        console.log('')
    }
    else {
        console.log('DB connection failed ERROR:' + JSON.stringify(err))
    }
})









// const mysql = require('mysql2');

// // create the connection to database
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'angshu',
//     password: 'abcde@123',
//     database: 'angshumaan'
// });

// connection.connect((err) => {
//     if (!err) {
//         console.log('DB connected');
//     }
//     else {
//         console.log('DB connection failed ERROR:' + JSON.stringify(err))
//     }
// })


module.exports = { connection }



