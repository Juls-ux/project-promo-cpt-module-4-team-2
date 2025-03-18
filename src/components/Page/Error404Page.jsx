import { Link } from "react-router";

function Error404Page() {
  return (
    <>
      Error 404: Página no encontrada;
      <Link className="button--link" to="/MainPage">
        Volver
      </Link>
    </>
  );
}

export default Error404Page;
