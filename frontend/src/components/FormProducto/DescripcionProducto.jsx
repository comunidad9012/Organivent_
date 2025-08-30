// DescripcionProducto.jsx
import { Editor } from "@tinymce/tinymce-react";

export default function DescripcionProducto({ editorRef, handleEditorChange, producto }) {
  return (
    <div className="mb-2">
      <p className="block m-2 font-bold">Descripción:</p>
      <Editor
        apiKey='1hyldt9u4byda8tjkhrxwy3zqocdzt2fujo24fy4spgi9wmc'
        onInit={(evt, editor) => editorRef.current = editor}
        init={{ height: 300, menubar: true, language: 'es' }}
        onEditorChange={handleEditorChange}
        value={producto.descripcion}
      />
    </div>
  );
}
