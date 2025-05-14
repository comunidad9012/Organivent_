import { useNavigate } from "react-router-dom";
import { resetUser } from "../redux/userSlice";
import { PublicRoutes } from "../models/routes";
import { useDispatch } from "react-redux";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.warn("Error cerrando sesión:", error);
    }

    dispatch(resetUser());
    navigate(PublicRoutes.LOGIN, { replace: true });
  };

  return (
    <button className="button-pretty" onClick={logOut}>Log Out</button>
  );
}

export default Logout;
