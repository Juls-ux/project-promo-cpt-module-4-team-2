import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Layout/Header";
import MainPage from "./Page/MainPage";
import Footer from "./Layout/Footer";
import "../styles/App.scss";
import Landing from "./Page/Landing";
import Error404Page from "./Page/Error404Page";

const INIT_OBJ = {
  name: "",
  slogan: "",
  technologies: "",
  repo: "",
  demo: "",
  desc: "",
  autor: "",
  job: "",
  photo: "",
  image: "",
};

const INIT_ERRORS = {
  name: "",
  slogan: "",
  technologies: "",
  repo: "",
  demo: "",
  desc: "",
  autor: "",
  job: "",
  image: "",
  photo: "",
};

function App() {
  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem("projectData");
    return storedData ? JSON.parse(storedData) : INIT_OBJ;
  });

  const [errors, setErrors] = useState(INIT_ERRORS);

  const [fetchError, setFetchError] = useState('');

  const [ projectUrl, setProjectUrl ] = useState( '' );
  
  useEffect(() => {
    localStorage.setItem("projectData", JSON.stringify(formData));
  }, [formData]);

  const handleFetch = (ev) => {
    ev.preventDefault();
    const isValid = validateForm();
    setFetchError('');
    
    
    if(isValid) {
    
    fetch('https://dev.adalab.es/api/projectCard', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body:JSON.stringify(formData)
    })
    .then( response => response.json())
    .then( responseData => {
      console.log(responseData)
      if (responseData.success === false) {
        setFetchError(responseData.error)
      }
      else {
        setFetchError('');
        setFormData(INIT_OBJ);
        setProjectUrl(responseData.cardURL)
                
      }     
    })
  }
  }

  const validateForm = () => {
    let isValid = true;
    let newErrors = { ...INIT_ERRORS };

    if (!formData.name.trim()) {
      newErrors.name = "Campo Obligatorio";
      isValid = false;
    }

    if (!formData.slogan.trim()) {
      newErrors.slogan = "Campo Obligatorio";
      isValid = false;
    }

    if (!formData.technologies.trim()) {
      newErrors.technologies = "Campo Obligatorio";
      isValid = false;
    }

    if (!formData.repo.trim()) {
      newErrors.repo = "Campo Obligatorio";
      isValid = false;
    }

    if (!formData.demo.trim()) {
      newErrors.demo = "Campo Obligatorio";
      isValid = false;
    }

    if (!formData.desc.trim()) {
      newErrors.desc = "Campo Obligatorio";
      isValid = false;
    }

    if (!formData.autor.trim()) {
      newErrors.autor = "Campo Obligatorio";
      isValid = false;
    }

    if (!formData.job.trim()) {
      newErrors.job = "Campo Obligatorio";
      isValid = false;
    }

    if (!formData.photo) {
      newErrors.photo = "Campo Obligatorio";
      isValid = false;
    }

    if (!formData.image) {
      newErrors.image = "Campo Obligatorio";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleInputChange = (inputName, inputValue) => {
    setFormData((prevData) => ({
      ...prevData,
      [inputName]: inputValue,
    }));

    const updatedErrors = { ...errors, [inputName]: "" };
    setErrors(updatedErrors);
  };

   
  return (
    <div className="container">
      <Header />
      <main> {/*Prueba para la landing*/}
        <Routes>
          <Route index element={<Landing />} />
          <Route
            path="/MainPage"
            element={
              <>
                <MainPage
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  validateForm={validateForm}
                  handleFetch= {handleFetch}
                  fetchError = {fetchError}
                  projectUrl={projectUrl}
                  
                />
              </>
            }
          />
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
