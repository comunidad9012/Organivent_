import { useState } from "react";
import { Helmet } from 'react-helmet';
import useAutenticacion from "./hooks/useAutenticacion";
import useCreateClient from "./hooks/useCreateClient";
import Loading from "../utilities/Loading";

import "../styles/Login.css";

function Login() {
    const [isSignUpMode, setIsSignUpMode] = useState(false);

    const { handleInicioSesion , user, setUser, error, messageAuth } = useAutenticacion();
    const { handleRegister, registUser, setRegistUser, handleDNIChange, loading, messageCreate } = useCreateClient();

    return (
        <div className="flex justify-center w-full">
            {/* // crear de cuenta --------------------------------------- */}
            <div className={`containerLogin ${isSignUpMode ? "right-panel-active" : ""}`} id="containerLogin">
                <Helmet>
                    <title>Login</title>
                </Helmet>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-containerLogin sign-up-containerLogin align-content-center">
                    <form className="form-pretty" onSubmit={handleRegister}>
                        <h1>Crear cuenta</h1>
                        <div className="infield">
                            <input 
                                required
                                type="text" 
                                placeholder="Nombre" 
                                value={registUser.nombre}
                                onChange={(e) => setRegistUser({...registUser, nombre: e.target.value})}
                            />
                            <label></label>
                        </div>
                        <div className="infield">
                            <input 
                                required
                                type="text" 
                                placeholder="DNI" 
                                value={registUser.DNI_cliente}
                                onChange={handleDNIChange}
                                // onChange={(e) => setRegistUser({...registUser, DNI_cliente: e.target.value})}
                            />
                            <label></label>
                        </div>
                        <div className="infield">
                            <input 
                                required
                                type="email" 
                                placeholder="Email" 
                                value={registUser.email}
                                onChange={(e) => setRegistUser({...registUser, email: e.target.value})}
                            />
                            <label></label>
                        </div>
                        <div className="infield">
                            <input 
                                required
                                type="text" 
                                placeholder="Nombre de usuario" 
                                value={registUser.nombre_usuario}
                                onChange={(e) => setRegistUser({...registUser, nombre_usuario: e.target.value})}
                            />
                            <label></label>
                        </div><div className="infield">
                            <input
                                required
                                type="password" 
                                placeholder="Contraseña" 
                                value={registUser.Contraseña}
                                onChange={(e) => setRegistUser({...registUser, Contraseña: e.target.value})}
                            />
                            <label></label>
                        </div>
                        {/* <button onClick={() => setIsSignUpMode(true)}>Registrarme</button> */}
                        {!loading && (<button className="button-pretty" type="submit">Registrarme</button>)}
                        {loading && <Loading/>}
                        {messageCreate && (
                            <div className="floating-alert">
                                <div className="alert alert-info">{messageCreate}</div>
                            </div>
                            )}
                    </form>
                </div>
                
                
                {/* Iniciar sesión --------------------------------------- */}
                <div className="form-containerLogin sign-in-containerLogin align-content-center">
                    <form className="form-pretty" onSubmit={handleInicioSesion}>
                        <h1>Iniciar sesión</h1>
                        <div className="infield">
                            <input 
                                required
                                type="email" 
                                placeholder="Email" 
                                value={user.email}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                            />
                            <label></label>
                        </div>
                        <div className="infield">
                            <input 
                                required
                                type="password" 
                                placeholder="Contraseña" 
                                value={user.password}
                                onChange={(e) => setUser({...user, password: e.target.value})}
                            />
                            <label></label>
                        </div>
                        <button className="button-pretty" type="submit">Ingresar</button>
                    

                        {messageAuth && (
                            <div className="floating-alert">
                                <div className="alert alert-info">{messageAuth}</div>
                            </div>
                            )}

                    </form>
                    {error && <p>{error}</p>}
                    
                </div>
                <div className="overlay-containerLogin" id="overlayCon">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>¿Ya tenés cuenta?</h1>
                            <p>Ingresá a tu cuenta aquí</p>
                            <button className="button-pretty" onClick={() => setIsSignUpMode(false)}>Ingresar</button>

                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>¿No tenés cuenta?</h1>
                            <p>¡Registrate para ser parte!</p>
                            <button className="button-pretty" onClick={() => setIsSignUpMode(true)}>Registrarme</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

