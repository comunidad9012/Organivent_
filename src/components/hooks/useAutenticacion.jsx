import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createUser, resetUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../../models/routes";

function useAutenticacion() {

    // const [loading, setLoading] = useState(false);
    const [messageAuth, setMessageAuth] = useState('');

    const [user , setUser] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState(null);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //este effect es para que cuando viaje a ruta /login se borre el usuario de redux y no pueda volver a la ruta en la que estaba (evita inconsistencias)
    useEffect(() => {
        if (window.location.pathname === `/${PublicRoutes.LOGIN}`) {
            dispatch(resetUser());
            //   clearLocalStorage(UserKey);
        }
      }, []);
      

  const handleInicioSesion = async (e) => {
    e.preventDefault(); 
    try {
        // setLoading(true);
        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user }),
            credentials: "include" //le dice al navegador: “enviá las cookies (como la de jwt) con esta solicitud, y también aceptá las cookies que vengan del backend”
        });
        const data = await response.json();
        if (response.ok) {
            // Guarda en Redux
            dispatch(createUser(data));
            console.log("Usuario logueado: ", data);
            navigate(`/${PrivateRoutes.PRIVATE}`, {replace: true}); //el replace es para remplazar /login por /private en la ruta
            setMessageAuth('¡Autenticación exitosa!');
        } else {
            // console.log("Error: ", data.message);
            setMessageAuth('Nombre de usuario o contraseña inválidos');
        }
    } catch (err) {
        setError('Nombre de usuario o contraseña inválidos');
    }
    setTimeout(() => setMessageAuth(""), 3000);
};


  return { handleInicioSesion , user, setUser, error, messageAuth }
}
export default useAutenticacion