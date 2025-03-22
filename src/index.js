const mysql = require ('mysql2/promise');

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { v4: uuid } = require('uuid');

const coolProjectsModel = require('./model/coolProjectsModel');
const verifiers = require('./utils/verifiers');

const ejs = require('ejs'); // Importar EJS

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
app.use(express.json({ limit: '50mb' }));


// Ruta de ejemplo
app.get('/', (req, res) => {
    const idUnico = uuid(); // Generar un UUID único
    res.render('projectCard', { id: idUnico }); // Pasar el UUID a la plantilla
});


//Arrancamos Servidor

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Cool Projects server started at <http://localhost:${PORT}/>`);  
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
    try {
        // Validación de datos vacíos
        if (verifiers.checkEmpty(req.body.name)) {
            return res.status(400).json({
                success: false,
                error: 'El nombre del proyecto está vacío'
            });
        }

        if (verifiers.checkEmpty(req.body.author)) {
            return res.status(400).json({
                success: false,
                error: 'El nombre de la autora está vacío'
            });
        }

        // Generar UUID para el proyecto
        const id_projects = uuid();

        // Obtener datos del cuerpo de la solicitud
        const { name, slogan, repo, demo, technologies, desc, image, author, job, photo } = req.body;

        // Conexión a la base de datos
        const conn = await getConnection();
        
        // Insertar el proyecto en la base de datos
        await conn.execute(
            `INSERT INTO projects (id_projects, name, slogan, repo, demo, technologies, description, project_img) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_projects, name, slogan, repo, demo, technologies, desc, image]
        );
        
        // Insertar la autora en la base de datos
        await conn.execute(
            `INSERT INTO authors (id_projects, author, job, author_img) VALUES (?, ?, ?, ?)`,
            [id_projects, author, job, photo]
        );

  

        const id = await coolProjectsModel.create(req.body);
        // Responder con éxito y la URL de la tarjeta
        res.json({
            success: true,
            cardURL: `${req.protocol}://${req.hostname}/projectCard/${id}`
        });

        await conn.end();
    } catch (err) {
        console.error("Error al insertar en la BD:", err);
        res.status(500).json({
            success: false,
            error: 'El servidor no está disponible en estos momentos'
        });
    }
});


app.get('/projectCard/:id_projects', async (req, res) => {

    console.log(req.params.id_projects);
    
    // SELECT


    
    // EJS
    res.render('projectCard', {projectData})
  });
  
  
  // Servidor de estáticos
  
  const path = require('node:path');
  
  //app.use(express.static(path.join(__dirname, 'static_detail_styles')));
  
  //app.use(express.static(path.join(__dirname, 'static_public_frontend')));
  
  /*app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'static_public_frontend', 'index.html'));
  });*/


  ////SELECT * FROM projects p JOIN authors a ON (p.id_projects = a.id_projects);