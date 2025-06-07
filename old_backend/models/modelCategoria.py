from pymongo import MongoClient
from bson.objectid import ObjectId

class Categoria:
    """
    A class to handle CRUD operations for categories in a MongoDB database.
    """

    def __init__(self, mongo_uri):
        """
        Initialize the Categoria class with a MongoDB connection.

        Args:
            mongo_uri (str): The MongoDB connection URI.
        """
        client = MongoClient(mongo_uri)
        self.db = client.get_database()  # Accede a la base de datos predeterminada
        self.categorias = self.db['Categoria']

    def create_categoria(self, nombre_categoria, descripcion, subcategorias):
        """
        Create a new category in the database.

        Args:
            nombre_categoria (str): The name of the category.
            descripcion (str): A description of the category.
            subcategorias (list): A list of subcategories.

        Returns:
            tuple: A dictionary containing the inserted ID and the HTTP status code 201.
        """
        categoria = {
            "nombre_categoria": nombre_categoria,
            "descripcion": descripcion,
            "subcategorias": subcategorias
        }
        result = self.categorias.insert_one(categoria)
        return {'id': str(result.inserted_id)}, 201

    def update_categoria(self, nombre_categoria, update_fields):
        """
        Update an existing category in the database.

        Args:
            nombre_categoria (str): The name of the category to update.
            update_fields (dict): A dictionary containing the fields to update and their new values.

        Returns:
            tuple: A dictionary containing the number of matched and modified documents, and the HTTP status code 200.
        """
        result = self.categorias.update_one(
            {"nombre_categoria": nombre_categoria},
            {"$set": update_fields}
        )
        return {'matched_count': result.matched_count, 'modified_count': result.modified_count}, 200

    def delete_categoria(self, nombre_categoria):
        """
        Delete a category from the database.

        Args:
            nombre_categoria (str): The name of the category to delete.

        Returns:
            tuple: A dictionary containing the number of deleted documents and the HTTP status code 200.
        """
        result = self.categorias.delete_one({"nombre_categoria": nombre_categoria})
        return {'deleted_count': result.deleted_count}, 200

    def get_all_categorias(self):
        """
        Retrieve all categories from the database.

        Returns:
            list: A list of all categories, with ObjectId converted to string.
        """
        categorias = list(self.categorias.find())
        for categoria in categorias:
            categoria['_id'] = str(categoria['_id'])
        return categorias

    def get_categoria_by_nombre(self, nombre_categoria):
        """
        Retrieve a specific category by its name.

        Args:
            nombre_categoria (str): The name of the category to retrieve.

        Returns:
            dict: The category document if found, with ObjectId converted to string, or None if not found.
        """
        categoria = self.categorias.find_one({"nombre_categoria": nombre_categoria})
        if categoria:
            categoria['_id'] = str(categoria['_id'])
        return categoria