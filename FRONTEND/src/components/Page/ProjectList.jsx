import { useEffect, useState } from 'react';


function ProjectList(){

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/projects-list') // Reemplaza con la URL de tu backend
            .then(response => response.json())
            .then(data => setProjects(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <>
        <div className='listado'>
            <h2 className='title'>Últimos proyectos subidos</h2>
            <ul className='listado__ul'>
                {projects.map((project) => (
                    <li key={project.id_projects}>
                        <h3>{project.name}</h3>
                        <p>{project.slogan}</p>
                        <p>Autor: {project.author}</p>
                        <img className='listado__img' src={project.project_img} alt={project.name} width="200" />
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default ProjectList;