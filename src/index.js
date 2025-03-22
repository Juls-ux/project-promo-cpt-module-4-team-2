const mysql = require ('mysql2/promise');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ejs = require('ejs'); // Importar EJS
const { v4: uuidv4 } = require('uuid'); // Importar UUID


async function getConnection() {
    const connectionData = {
        host: process.env["MYSQL_HOST"],
        port: process.env["MYSQL_PORT"],
        user: process.env["MYSQL_USER"],
        password: process.env["MYSQL_PASS"],
        database: process.env["MYSQL_SCHEMA"]

    };

    console.log("Intentando conectar con la BD:", connectionData); // Debugging

    const connection = await mysql.createConnection(connectionData);
    await connection.connect();
    return connection;
}

const app = express();

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());


// Ruta de ejemplo
app.get('/', (req, res) => {
    const idUnico = uuidv4(); // Generar un UUID único
    res.render('index', { id: idUnico }); // Pasar el UUID a la plantilla
});


//Arrancamos Servidor

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port<http://localhost:${port}>`);
});



//1º endpoint Proyectos Molones-- AUTHORS

app.get('/api/authors', async (req, res) => {

    const conn = await getConnection();

    const [results] = await conn.query(`SELECT * FROM defaultdb.authors;`);

    await conn.end();

    const numOfElements = results.length;

    res.json({
        info: { count: numOfElements },
        results: results,

    });

});

//2º endpoint Proyectos Molones-- PROJECTS

app.get('/api/projects', async (req, res) => {

    const conn = await getConnection();

    const [results] = await conn.query(`SELECT * FROM defaultdb.projects;`);

    await conn.end();

    const numOfElements = results.length;

    res.json({
        info: { count: numOfElements },
        results: results,

    });

});


//3º endpoint con UUID
app.post('/api/projectCard/', async (req, res) => {
    const conn = await getConnection();
    const { name, slogan, technologies, repo, demo, desc, autor, job, photo, image } = req.body;

    if (!name || !autor) {
        return res.status(400).json({ success: false, error: "Faltan datos obligatorios" });
    }

    const projectId = uuidv4();
    const authorId = uuidv4();
    
    try {
        // Insertar autora
        await conn.query(
            `INSERT INTO authors (id, name, job, photo) VALUES (?, ?, ?, ?)`,
            [authorId, autor, job, photo]
        );

        // Insertar proyecto
        await conn.query(
            `INSERT INTO projects (id, name, slogan, technologies, repo, demo, description, image, author_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [projectId, name, slogan, technologies, repo, demo, desc, image, authorId]
        );

        // Datos para la plantilla EJS
        const datosQueLePasamosALaPlantilla = {
            projectId,
            name,
            slogan,
            technologies,
            repo,
            demo,
            desc,
            autor,
            job,
            photo,
            image
        };

        // Renderizar la plantilla con los datos
        res.render('projectCard', datosQueLePasamosALaPlantilla);
        
        await conn.end();

    } catch (error) {
        console.error("Error al insertar en la BD:", error);
        res.status(500).json({ success: false, error: "Error en el servidor" });
    }
});