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
import { Trash } from 'lucide-react';

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
    <div onClick={(e) => e.stopPropagation()}>
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <button
        type="button"
        className="p-2 rounded bg-red-500 hover:bg-red-600 text-white shadow"
      >
        <Trash size={18}/>
      </button>
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
          <AlertDialogCancel className="rounded">Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-500 rounded" 
            onClick={handleDelete}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
    
  );
}

export default DeleteProduct;
