import { Route, Routes } from "react-router-dom"

function RoutesWhitNotFound({ children }) {
  return (
    <Routes>
        {children}
        <Route path='*' element={<h1>Not Found</h1>} />
        {/* esto es agregar siempre al final de las rutas el * not found */}
    </Routes>
  )
}
export default RoutesWhitNotFound