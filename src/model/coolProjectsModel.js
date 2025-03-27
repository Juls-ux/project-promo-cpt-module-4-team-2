const { v4: uuid } = require('uuid');
const verifiers = require('../utils/verifiers');
const mysql = require('mysql2/promise');
require('dotenv').config();


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

async function create(data) {

  // Validación de datos vacíos
  if (verifiers.checkEmpty(data.name)) {
    return res.status(400).json({
      success: false,
      error: 'El nombre del proyecto está vacío'
    });
  }

  if (verifiers.checkEmpty(data.author)) {
    return res.status(400).json({
      success: false,
      error: 'El nombre de la autora está vacío'
    });
  }

  // Generar UUID para el proyecto
  const id_projects = uuid();

  // Obtener datos del cuerpo de la solicitud
  const { name, slogan, repo, demo, technologies, desc, image, author, job, photo } = data;

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

  // Cerrar la conexión
  await conn.end();

  return id_projects;  // Retornar el primer (y único) resultado
}

async function get(id_projects) {
  let conn;
  try {
    conn = await getConnection();

    const [results] = await conn.query(`
      SELECT projects.*, authors.author, authors.job, authors.author_img 
      FROM projects
      JOIN authors ON projects.id_projects = authors.id_projects
      WHERE projects.id_projects = ?
    `, [id_projects]);

    // Check if the project was found
    if (results.length === 0) {
      throw new Error(`Project with ID ${id_projects} not found`);
    }

    return results[0];
  } catch (err) {
    console.error("Error fetching project:", err.message);
    throw new Error('Error fetching project details');
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}
module.exports = {
  create,
  get
}