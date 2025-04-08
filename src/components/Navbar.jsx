import { Link, useLocation } from "react-router-dom";
//import EditarProducto from "./EditarProducto";
import Categorias from './Categorias';
import SearchForm from './SearchForm';
import '../styles/navbar.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import store from "../redux/store";
import { useSelector } from "react-redux";
import { Roles } from "../models/roles";

function Navbar() {
    const location = useLocation(); // Obtener la ubicación actual
    const userState = useSelector(store => store.user) //consumo el estado de redux para saber si el usuario es admin o no
    
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
            {location.pathname !== '/' && (
                <Link className="navbar-brand fancy" to="/">
                    {/* Inicio */}
                    <span className="top-key"></span>
                    <span className="text">Inicio</span>
                    <span className="bottom-key-1"></span>
                    <span className="bottom-key-2"></span>
                </Link>
            )}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">


                        { userState.rol === null && (
                            <Link className="navbar-brand fancy" to="/createClient">
                                {/* Crear cuenta */}
                                <span className="top-key"></span>
                                <span className="text">Crear cuenta</span>
                                <span className="bottom-key-1"></span>
                                <span className="bottom-key-2"></span>
                            </Link>
                        )
                        }


                        { userState.rol === Roles.ADMIN && (
                            <Link className="navbar-brand fancy" to="/holiiiiss">
                                <span className="top-key"></span>
                                <span className="text">Cositas de admin</span>
                                <span className="bottom-key-1"></span>
                                <span className="bottom-key-2"></span>
                            </Link>
                        )}

                        {userState.rol === Roles.ADMIN && location.pathname !== '/Productos/editor' && (
                            <li className="nav-item">
                                <Link className="nav-link active fancy" aria-current="page" to="/Productos/editor">
                                    {/* Añadir producto */}
                                    <span className="top-key"></span>
                                    <span className="text">Añadir producto</span>
                                    <span className="bottom-key-1"></span>
                                    <span className="bottom-key-2"></span>
                                </Link>
                            </li>
                        )} 

                    </ul>
            
                    <Categorias />
                    <SearchForm />

                    { userState.rol !== null && (
                            "¡Hola " + userState.nombre_usuario + "!"
                        )}

                    {/* carrito */}
                   

                    { userState.rol === Roles.USER && (
                            <Link className="navbar-brand" to="/cart">
                            <button className="flex p-2 hover:bg-blue-300 rounded">
                                <svg
                                className="icon"
                                stroke="currentColor"
                                fill="none"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                height="1em"
                                width="3em"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path
                                    d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                                ></path>
                                </svg>
                            </button>
                            </Link>
                        )}

                    {/* Encontrar la forma de pasar el json a otro componente */}
                </div>
            </div>
        </nav>
    );
}


export default Navbar;
