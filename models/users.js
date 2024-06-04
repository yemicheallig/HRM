const mysql = require('mysql')

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'HRM'
})

const cDb = "CREATE DATABASE hrm "
const cTable = "CREATE TABLE users (id int(11) PRIMARY KEY AUTOINCREMENT,first_name varchar(255),last_name varchar(255),email varchar(255),pwd varchar(255),profile_pic varchar(255))"

module.exports = connection;