import { Link } from "react-router";
import PropTypes from "prop-types";
import Form from "../Projects/Form";
import Hero from "../Layout/Hero";
import Preview from "../Projects/Preview";

function MainPage({
  formData,
  handleInputChange,
  errors,
  handleFetch,
  fetchError,
  projectUrl
}) {
  return (
  
  <section className="main--grid" >
      <Hero>
        <Link className="button--link" to="/">
          Ver proyectos
        </Link>
      </Hero>
      <Preview formData={formData} />
      <Form
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
        handleFetch={handleFetch}
        fetchError={fetchError}
        projectUrl={projectUrl}
      />
  </section>
   
  );
}

MainPage.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  handleFetch: PropTypes.func.isRequired,
  fetchError: PropTypes.string.isRequired,
  projectUrl: PropTypes.string.isRequired,
};

export default MainPage;
