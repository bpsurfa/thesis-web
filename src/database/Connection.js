const mysql = require('mysql2');

const con = mysql.createConnection({
    host: process.env.DB_HOST  || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'custom_list',
    // waitForConnection: true,
    // connectionLimit: 10,
    // queueLimit: 0
});

// const con = mysql.createConnection({
//     host: 'sql.freedb.tech',
//     user: 'freedb_rmdldeleon',
//     password: '4sSxjd8MTBv6#?y',
//     database: 'freedb_custom_list',
//     // waitForConnection: true,
//     // connectionLimit: 10,
//     // queueLimit: 0
// });

// const con = mysql.createConnection({
//     host: 'http://31.220.17.234/',
//     user: 'rmdldeleon',
//     password: '152431524466aA',
//     database: 'custom_list',
//     // waitForConnection: true,
//     // connectionLimit: 10,
//     // queueLimit: 0
// });


con.connect((err) => {
    if(err){
        console.error('Error connecting to database:', err);
    } else {
        console.log("Connection successful");
    }
});


module.exports = { con }