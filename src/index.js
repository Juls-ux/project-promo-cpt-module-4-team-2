const mysql = require ('mysql2/promise');

const express = require('express');
const cors = require('cors');


async function getConnection() {
    const connectionData = {
        host: process.env["MYSQL_HOST"],
        port: process.env["MYSQL_PORT"],
        user: process.env["MYSQL_USER"],
        password: process.env["MYSQL_PASS"],
        database: process.env["MYSQL_SCHEMA"]

    };
    const connection = await mysql.createConnection(connectionData);
    await connection.connect();
    return connection;
}

const app = express();

app.use(cors());
app.use(express.json());

//Arrancamos Servidor

const port = 14573;
app.listen(port, () => {
    console.log(`Example app listening on port<http://localhost:${port}>`);
});
