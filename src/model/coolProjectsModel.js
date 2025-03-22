const { v4: uuid } = require('uuid');

const COOL_PROJECTS_STORAGE = [];


async function create(data) {
  const generated_id = uuid();

  // INSERT
  /*
  const [results] = conn.execute(`
    INSERT INTO projects (id_project, name, slogan)
    VALUES (?, ?, ?);
    `,
    [new_and_shinny_id, data.name, data.slogan, data.repo])
  */

  data.id = generated_id;
  COOL_PROJECTS_STORAGE.push(data);

  return generated_id;
}

function get(project_id) {

  // SELECT * FROM project JOIN authors ON (project.project_id = authors.project_id) WHERE project_id = ? 

  return COOL_PROJECTS_STORAGE.find(it => it.id === project_id)
}

module.exports = {
  create,
  get
}