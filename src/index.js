const mysql = require ('mysql2/promise');

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { v4: uuid } = require('uuid');

const coolProjectsModel = require('./model/coolProjectsModel');


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
    res.render('projectCardDetail', { id: idUnico }); // Pasar el UUID a la plantilla
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
      
            const id = await coolProjectsModel.create(req.body);
    
            res.json({
                success: true,
                cardURL: req.hostname === 'localhost'
                    ? `http://localhost:${PORT}/projectCard/${id}`
                    : `https://${req.hostname}/projectCard/${id}`
            });
    
        } catch (err) {
            console.error("Error al insertar en la BD:", err);
            res.status(500).json({
                success: false,
                error: 'El servidor no está disponible en estos momentos'
            });
        }
    });


    app.get('/projectCard/:id_projects', async (req, res) => {
        try {
            const id = req.params.id_projects;
            console.log("ID recibido:", id);
            
            // Obtener los datos del proyecto
            const projectData = await coolProjectsModel.get(id);
            console.log("Datos del proyecto:", projectData);
            
            if (!projectData) {
              console.log("No se encontró ningún proyecto con ID:", id);
              return res.status(404).send('Proyecto no encontrado');
            }
            
            // Asegúrate de que projectData se pasa correctamente a la plantilla
            console.log("Renderizando con datos:", { projectData });
            res.render('projectCardDetail', { projectData: projectData });
            
          } catch (error) {
            console.error("Error completo:", error);
            res.status(500).send('Error del servidor');
          }
      });
    

//4º Endpoint LISTADO DE PROYECTOS
app.get('/api/projects-list', async (req, res) => {
    const conn = await getConnection(); 
   
    try {
       
        const query = `
          SELECT * FROM defaultdb.projects
	JOIN authors ON projects.id_projects = authors.id_projects
	ORDER BY projects.id_projects DESC
	LIMIT 3
        `;
        
        
        const [rows] = await conn.query(query);
        res.json(rows);

    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: 'Error fetching projects' });

    } finally {
        if (conn) await conn.end(); // Cerrar conexión siempre
    }
});


//Estáticos
const path = require('node:path')
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, './static_files')));
app.use('/src/images', express.static(path.join(__dirname, 'src/images')));
app.use(express.static(path.join(__dirname, 'src/static_public_frontend/frontend')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'static_public_frontend', 'index.html'));
  });
