import Hero from "../Layout/Hero";
import { Link } from "react-router";
import landingImage from "/src/images/cool-project.png";

import ProjectList from "./ProjectList";


function Landing() {

  return (
    <>
      <section className="main hero-complex">
        <img
        src={landingImage}
        alt="Imagen de la landing"
        className="landingImage"
      />
        <Hero>
          <Link className="button--link" to="/MainPage">
            Nuevo proyecto
          </Link>

          <section>
           <ProjectList/>
          </section>
        </Hero>
      </section>
    </>
  );
}

export default Landing;
