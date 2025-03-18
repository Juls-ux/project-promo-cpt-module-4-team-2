import PropTypes from 'prop-types';

function Preview({formData}) {
  return (
    <section className="preview">
      <div className="projectImage" style={{ backgroundImage: formData.image ? `url(${formData.image})` : null }}></div>
      <article className="card">
        <h2 className="card__projectTitle"><span className="card__projectTitle--text">Personal project card</span></h2>

        <div className="card__author">
          <div className="card__authorPhoto"  style={{ backgroundImage: formData.photo ? `url(${formData.photo})` : null }}></div>
          <p className="card__job">{formData.job || "Full stack Developer"}</p>
          <h3 className="card__name">{formData.autor || "Emmelie Bjôrklund"}</h3>
        </div>

        <div className="card__project">
          <h3 className="card__name"> {formData.name || "Elegant Workspace"}</h3>
          <p className="card__slogan">{formData.slogan || "Diseños exclusivos"}</p>
          <h3 className="card__descriptionTitle">Product description</h3>
          <p className="card__description">{formData.desc || "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla, quos?"}</p>

          <div className="card__technicalInfo">
            <p className="card__technologies">{formData.technologies || "React JS - HTML - CSS"}</p>
            <a className="icon icon__www" href= {formData.demo || "https://google.com"} title="Haz click para ver el proyecto online" target="_blank" rel="noopener noreferrer">Web link</a>
            <a className="icon icon__github" href= {formData.repo || "https://github.com/"} title="Haz click para ver el código del proyecto" target="_blank" rel="noopener noreferrer">GitHub link</a>
          </div>
        </div>
      </article>
    </section>
  );
}

Preview.propTypes = {
formData: PropTypes.object.isRequired,
}

export default Preview;
