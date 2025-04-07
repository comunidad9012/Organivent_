from flask import Blueprint, request, current_app
from models.modelClient import ClientModel

Client_bp = Blueprint('Client', __name__, url_prefix='/Client')

@Client_bp.post("/createClient")
def create_client():
    """
    Create a new client in the system.

    This function handles the creation of a new client by accepting
    client data in JSON format from the request body and passing it
    to the ClientModel for processing.

    Returns:
        tuple: A tuple containing the response message and the HTTP status code.
    """
    data = request.json
    client_model = ClientModel(current_app)
    response, status = client_model.create_client(data)
    return response, status

#usar para que el admin vea info de sus clientes

@Client_bp.get("/showClients")
def show_clients():
    """
    Retrieve and display all clients.

    This function fetches all clients from the database using the
    ClientModel and returns the data for display.

    Returns:
        Response: A response object containing the list of clients.
    """
    client_model = ClientModel(current_app)
    response = client_model.show_clients()
    return response

@Client_bp.get("/viewClient/<id>")
def specific_client(id):
    """
    Retrieve and display a specific client by ID.

    Args:
        id (str): The unique identifier of the client to be retrieved.

    Returns:
        Response: A response object containing the client's details.
    """
    client_model = ClientModel(current_app)
    response = client_model.specific_client(id)
    return response

@Client_bp.post("/find_client")
def find_client():
    """
    Find a client based on a search keyword.

    This function searches for clients using a keyword provided in
    the request body and returns matching results.

    Returns:
        Response: A response object containing the search results.
    """
    data = request.json
    palabra = data['palabra']
    client_model = ClientModel(current_app)
    response = client_model.find_client(palabra=palabra)
    return response
