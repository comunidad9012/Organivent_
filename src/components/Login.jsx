import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createUser, resetUser, UserKey } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../models/routes";
import { clearLocalStorage } from "../utilities/localStorage.utility";

function Login() {
    
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
    );
}

export default Login;

