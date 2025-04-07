# Blueprint: Permite crear módulos separados para diferentes partes de la aplicación.
# request: Para acceder a los datos enviados en las solicitudes HTTP.
# current_app: Hace referencia a la aplicación Flask activa.

from flask import Blueprint, request, current_app, jsonify
from models.modelProductos import ProductosModel

Productos_bp = Blueprint('Productos', __name__, url_prefix='/Productos')

@Productos_bp.post("/createProductos")
def create_Productos():
    """
    Create a new product in the database.

    This function handles POST requests to create a new product. It receives the product data
    as JSON in the request body, creates a new product using the ProductosModel, and returns
    the response from the model.

    Returns:
        dict: A dictionary containing the response from the ProductosModel's create_Productos method.
              This typically includes information about the success or failure of the operation
              and potentially the details of the created product.
    """
    data = request.json  #Obtiene los datos enviados en la solicitud como un diccionario JSON.
    Productos_model = ProductosModel(current_app)  #Instancia el modelo de productos, conectándolo con la aplicación Flask activa.
    response = Productos_model.create_Productos(data) #Llama al método del modelo para crear el producto con los datos proporcionados.
    return response #Devuelve la respuesta al cliente (front en react).

# arreglar que si o si tiene que tener contenido el producto para crearlo.

@Productos_bp.delete("/deleteProductos/<id>")
def delete_product(id):
    Productos_model = ProductosModel(current_app)
    success = Productos_model.delete_product_by_id(id)
    if success:
        return jsonify({"message": "Producto eliminado con éxito"}), 200
    else:
        return jsonify({"error": "No se encontró el producto"}), 404


@Productos_bp.get("/showProductos") #CAMBIE LA PETICION POST POR GET, YA QUE CON ESTO QUEREMOS TRAER LOS DATOS EN EL FRONT
def show_Productos():
    Productos_model=ProductosModel(current_app)
    response=Productos_model.show_Productos()
    return response

@Productos_bp.get("/viewProductos/<id>")
def specific_product(id):
    Productos_model=ProductosModel(current_app)
    response=(Productos_model.specific_product(id)).json
    return response

@Productos_bp.post("/find_product") #cambie por post para poder usar el formulario, si lo puedo arreglar la vuelvo a get
def find_product():
    data=request.json
    palabra = data['palabra'] 
    Productos_model = ProductosModel(current_app)
    response = Productos_model.find_Productos(palabra=palabra)
    return response

@Productos_bp.get("/showProductosPorCategoria/<id_categoria>")
def get_productos_por_categoria(id_categoria):
    id_categoria = id_categoria.replace("%20", " ")  # Decodifica espacios si es necesario
    print("Categoría recibida:", id_categoria)  # Debug en consola
    Productos_model = ProductosModel(current_app)#saque current_app.mongo.db  //posible problemita con Productos
    response = Productos_model.get_productos_by_categoria(id_categoria) #----------
    return response

@Productos_bp.put("/update/<id>")
def update_product(id):
    """
    Update an existing product in the database.

    This function handles PUT requests to update a product. It receives the updated product data
    as JSON in the request body, updates the corresponding product in the database, and returns
    a response indicating success or failure.

    Returns:
        dict: A dictionary containing the response from the ProductosModel's update_product method.
    """
    data = request.json  # Obtiene los datos enviados en la solicitud como JSON.
    Productos_model = ProductosModel(current_app)  # Instancia el modelo de productos.
    response = Productos_model.update_product(id, data)  # Llama al método del modelo.
    return response  # Devuelve la respuesta.
