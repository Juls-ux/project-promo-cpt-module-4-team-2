const { v4: uuid } = require('uuid');
const COOL_PROJECTS_STORAGE = [];


async function create(data) {
  const generated_id = uuid();

  const [results] = conn.execute(`
    INSERT INTO projects (id_projects, name, slogan, repo, demo, technologies, desc, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `,
  [ generated_id, data.name, data.slogan, data.repo, data.demo, data.technologies, data.desc, data.image])

 // return generated_id;
  
  // Cerrar la conexión
  await conn.end();
  
  // Verificar si se encontraron resultados
  if (results.length > 0) {
      return results[0];  // Retornar el primer (y único) resultado
  } else {
      return null;  // Si no hay resultados, devolver null
  }
}

function get(id_projects) {

 // SELECT * FROM projects JOIN authors ON (projects.id_projects = authors.id_projects) WHERE project_id = ?;
 return COOL_PROJECTS_STORAGE.find(it => it.id === id_projects)
}

module.exports = {
  create,
  get
}