const config = require('../config/config');
const mysql = require('mysql2');

const connection = mysql.createPool({
    host: config.development.host,
    user: config.development.username,
    password: config.development.password,
    port: config.development.port,
    database: config.development.database
});

const promisePool = connection.promise();

module.exports = promisePool;