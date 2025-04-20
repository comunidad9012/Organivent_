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
        <>
        {/* -------- Esta parte es la que es de mi sistema y funciona - */}
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                {/* aca falta el label*/}
                <input
                    type="text"
                    placeholder="Username"
                    value={user.username}
                    onChange={(e) => setUser({...user, username: e.target.value})}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={(e) => setUser({...user, password: e.target.value})}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}

            {/* ver si esto aca queda bien */}
            <h5>¿No tenes cuenta?</h5>
            <button onClick={() => navigate('/createClient')}>Registrate</button> 
        </div>
        {/* ---------------- */}



        {/* --------esta es la parte del video que quiero hacer funcionar con la logica del anterior */}
        <div className={`container ${isSignUpMode ? "right-panel-active" : ""}`} id="container">

            {/* <div class="container" id="container"> */}
                <div class="form-container sign-up-container">
                    <form action="#">
                        <h1>Create Account</h1>
                        <div class="social-container">
                            <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
                            <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
                        </div>
                        <span>or use your email for registration</span>
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
                        <button onClick={() => setIsSignUpMode(true)}>Sign Up</button>
                    </form>
                </div>
                <div class="form-container sign-in-container">
                    <form action="#">
                        <h1>Sign in</h1>
                        <div class="social-container">
                            <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
                            <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
                        </div>
                        <span>or use your account</span>
                        <div class="infield">
                            <input type="email" placeholder="Email" name="email"/>
                            <label></label>
                        </div>
                        <div class="infield">
                            <input type="password" placeholder="Password" />
                            <label></label>
                        </div>
                        <a href="#" class="forgot">Forgot your password?</a>
                        <button onClick={() => setIsSignUpMode(false)}>Sign In</button>

                    </form>
                </div>
                <div class="overlay-container" id="overlayCon">
                    <div class="overlay">
                        <div class="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button onClick={() => setIsSignUpMode(false)}>Sign In</button>

                        </div>
                        <div class="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button onClick={() => setIsSignUpMode(true)}>Sign Up</button>
                        </div>
                    </div>
                    <button id="overlayBtn"></button>
                </div>
            </div>

        </>
    );
}

export default Login;

