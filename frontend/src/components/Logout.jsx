import { useNavigate } from "react-router-dom";
import { resetUser, UserKey } from "../redux/userSlice"
import { clearLocalStorage } from "../utilities/localStorage.utility"
import { PublicRoutes } from "../models/routes";
import { useDispatch } from "react-redux";

function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const logOut = () => {
        clearLocalStorage(UserKey)
        dispatch(resetUser());
        navigate(PublicRoutes.LOGIN, {replace: true});
    };

  return (
    <button className="button-pretty" onClick={logOut}>Log Out</button>
  )
}
export default Logout