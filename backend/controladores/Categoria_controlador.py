from flask import Blueprint, request, current_app
from models.modelCategoria import Categoria

Categoria_bp = Blueprint('Categoria', __name__, url_prefix='/Categoria')

@Categoria_bp.get("/showCategorias")
def get_categorias():
    """
    Retrieve all categories from the database.

    Returns:
        response (str): A JSON string containing all categories.
    """
    # Accede a mongo a través de current_app
    categoria_model = Categoria(current_app.config['MONGO_URI'])  # Inicializa con la URI de MongoDB
    response = categoria_model.get_all_categorias()
    return response

@Categoria_bp.get("/viewCategoria/<nombre_categoria>")
def get_categoria(nombre_categoria):
    """
    Retrieve a specific category by its name.

    Parameters:
        nombre_categoria (str): The name of the category to retrieve.

    Returns:
        response (str): A JSON string containing the category details.
    """
    # Accede a mongo a través de current_app
    categoria_model = Categoria(current_app.config['MONGO_URI'])  # Inicializa con la URI de MongoDB
    response = categoria_model.get_categoria_by_nombre(nombre_categoria)
    return response

@Categoria_bp.post("/createCategoria")
def create_categoria():
    """
    Create a new category in the database.

    The request must contain a JSON body with the following fields:
        - nombre_categoria (str): The name of the category.
        - descripcion (str): A description of the category.
        - subcategorias (list): A list of subcategories.

    Returns:
        response (str): A JSON string indicating the result of the operation.
        status (int): The HTTP status code of the response.
    """
    data = request.json
    # Accede a mongo a través de current_app
    categoria_model = Categoria(current_app.config['MONGO_URI'])  # Inicializa con la URI de MongoDB
    response, status = categoria_model.create_categoria(data['nombre_categoria'], data['descripcion'], data['subcategorias'])
    return response, status

@Categoria_bp.put("/updateCategoria/<nombre_categoria>")
def update_categoria(nombre_categoria):
    """
    Update an existing category in the database.

    Parameters:
        nombre_categoria (str): The name of the category to update.

    The request must contain a JSON body with the fields to update.

    Returns:
        response (str): A JSON string indicating the result of the operation.
        status (int): The HTTP status code of the response.
    """
    data = request.json
    # Accede a mongo a través de current_app
    categoria_model = Categoria(current_app.config['MONGO_URI'])  # Inicializa con la URI de MongoDB
    response, status = categoria_model.update_categoria(nombre_categoria, data)
    return response, status

@Categoria_bp.delete("/deleteCategoria/<nombre_categoria>")
def delete_categoria(nombre_categoria):
    """
    Delete a category from the database by its name.

    Parameters:
        nombre_categoria (str): The name of the category to delete.

    Returns:
        response (str): A JSON string indicating the result of the operation.
        status (int): The HTTP status code of the response.
    """
    # Accede a mongo a través de current_app
    categoria_model = Categoria(current_app.config['MONGO_URI'])  # Inicializa con la URI de MongoDB
    response, status = categoria_model.delete_categoria(nombre_categoria)
    return response, status
