import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner"

function DeleteProduct({ product, setProductos }) {

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/Productos/deleteProductos/${product._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setProductos((prev) => prev.filter((p) => p._id !== product._id));
        toast.success(`Producto "${product.nombre_producto}" eliminado con éxito.`)
      } else {
        toast.error(data.message || "Hubo un error al intentar eliminar el producto.");
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      toast.error("Hubo un problema al intentar eliminar el producto.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button" className="btn btn-danger mt-2">Borrar</button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white dark:bg-zinc-900 shadow-lg">
        <AlertDialogHeader className="m-4">
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>
            Esta acción eliminará el producto "{product.nombre_producto}" y no se podrá deshacer.
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="m-4">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 rounded-md" onClick={handleDelete}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
  );
}

export default DeleteProduct;
