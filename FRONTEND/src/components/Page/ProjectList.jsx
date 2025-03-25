import { useEffect, useState } from 'react';
import PreviewCard from '../Projects/PreviewCard';

const API_URL = import.meta.env.PROD ?  '/api/projects-list' : 'http://localhost:3000/api/projects-list';

function ProjectList(){

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch(API_URL) // Reemplaza con la URL de tu backend
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
                        <PreviewCard formData={project} />
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default ProjectList;