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
import { Trash } from "lucide-react"

type DeleteItemProps<T> = {
  item: T
  itemName: string                      // Nombre a mostrar (ej: "producto X", "pedido Y")
  resource: string                      // Recurso de la API (ej: "Productos", "Pedidos", "Descuentos")
  endpoint?: string                     // Si la API difiere del formato por defecto
  setItems: React.Dispatch<React.SetStateAction<T[]>>
  getId: (item: T) => string             // Cómo obtener el _id del item
}

function DeleteItem<T>({
  item,
  itemName,
  resource,
  endpoint,
  setItems,
  getId,
}: DeleteItemProps<T>) {
  const handleDelete = async () => {
    try {
      const id = getId(item)
      const url = endpoint
        ? `${endpoint}/${id}`
        : `http://localhost:5000/${resource}/delete${resource}/${id}`

      const response = await fetch(url, { method: "DELETE" })
      const data = await response.json()

      if (response.ok) {
        setItems((prev) => prev.filter((i) => getId(i) !== id))
        toast.success(`${resource.slice(0, -1)} "${itemName}" eliminado con éxito.`)
      } else {
        toast.error(data.message || "Hubo un error al intentar eliminar.")
      }
    } catch (error) {
      console.error("Error al eliminar:", error)
      toast.error("Hubo un problema al intentar eliminar el elemento.")
    }
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            data-no-nav
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded bg-red-500 hover:bg-red-600 text-white shadow"
          >
            <Trash size={18} />
          </button>
        </AlertDialogTrigger>


        <AlertDialogContent className="bg-white dark:bg-zinc-900 shadow-lg">
          <AlertDialogHeader className="m-4">
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>
                Esta acción eliminará "{itemName}" y no se podrá deshacer.
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
  )
}

export default DeleteItem
