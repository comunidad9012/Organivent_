import { useNavigate } from "react-router-dom";
import { resetUser } from "../redux/userSlice";
import { PublicRoutes } from "../models/routes";
import { useDispatch } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      toast.success("Sesión cerrada correctamente.");
    } catch (error) {
      toast.error(error || "Hubo un error al intentar cerrar sesión.");
      console.warn("Error cerrando sesión:", error);
    }

    dispatch(resetUser());
    navigate(PublicRoutes.LOGIN, { replace: true });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="block w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
        >
          Sign out
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white dark:bg-zinc-900 shadow-lg">
        <AlertDialogHeader className="m-4">
          <AlertDialogTitle>¿Salir de la sesión?</AlertDialogTitle>
         
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 rounded"
            onClick={logOut}
          >
            Salir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Logout;
