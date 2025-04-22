import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createUser, resetUser, UserKey } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../models/routes";
import { clearLocalStorage } from "../utilities/localStorage.utility";
import "../styles/Login.css";

function Login() {
    
    const [isSignUpMode, setIsSignUpMode] = useState(false);

    const [user , setUser] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState(null);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //este effect es para que cuando viaje a ruta /login se borre el usuario del localstorage y no pueda volver a la ruta en la que estaba (evita inconsistencias)
    useEffect(() => {
        clearLocalStorage(UserKey);
        dispatch(resetUser());
        navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
      }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); //esto esta igual que otros submit de fomularios
    console.log("User:", user); //SACAAARRRR------------------

    //aca se pone el cargando: setLoading(true);
    try {
        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user }),
        });
        console.log("los datos volvieron del back") //SACAAARRRR--------------------------------------------
        console.log(response) //SACAAARRRR--------------------------------------------
        const data = await response.json();
        if (response.ok) {
            console.log("tengo la data que llegó del back", data); //SACAAARRRR------------------
            dispatch(createUser(data));  // Guarda en Redux
            navigate(`/${PrivateRoutes.PRIVATE}`, {replace: true}); //el replace es para remplazar /login por /private en la ruta
        } else {
            console.log("Error: la respuesta no fue ok", data.message);
        }
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (

        // crear de cuenta ---------------------------------------
        <div className={`containerLogin ${isSignUpMode ? "right-panel-active" : ""}`} id="containerLogin">
            <div class="form-containerLogin sign-up-containerLogin align-content-center">
                <form action="#">
                    <h1>Crear cuenta</h1>
                    <div class="infield">
                        <input type="text" placeholder="Name" />
                        <label></label>
                    </div>
                    <div class="infield">
                        <input type="email" placeholder="Email" name="email"/>
                        <label></label>
                    </div>
                    <div class="infield">
                        <input type="password" placeholder="Password" />
                        <label></label>
                    </div>
                    <button onClick={() => setIsSignUpMode(true)}>Registrarme</button>
                </form>
            </div>
            
            
            {/* Iniciar sesión --------------------------------------- */}
            <div class="form-containerLogin sign-in-containerLogin align-content-center">
                <form onSubmit={handleLogin}>
                    <h1>Iniciar sesión</h1>
                    <div class="infield">
                        <input 
                            type="text" 
                            placeholder="Nombre de usuario" 
                            value={user.username}
                            onChange={(e) => setUser({...user, username: e.target.value})}
                        />
                        <label></label>
                    </div>
                    <div class="infield">
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            value={user.password}
                            onChange={(e) => setUser({...user, password: e.target.value})}
                        />
                        <label></label>
                    </div>
                    <button type="submit">Ingresar</button>
                </form>
                {error && <p>{error}</p>}
                
            </div>
            <div class="overlay-containerLogin" id="overlayCon">
                <div class="overlay">
                    <div class="overlay-panel overlay-left">
                        <h1>¿Ya tenés cuenta?</h1>
                        <p>Ingresá a tu cuenta aquí</p>
                        <button onClick={() => setIsSignUpMode(false)}>Ingresar</button>

                    </div>
                    <div class="overlay-panel overlay-right">
                        <h1>¿No tenés cuenta?</h1>
                        <p>¡Registrate para ser parte!</p>
                        <button onClick={() => setIsSignUpMode(true)}>Registrarme</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

