from flask_pymongo import PyMongo
from flask import Response
from bson import json_util, ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

class ClientModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def create_client(self, data):
        existing_client = self.mongo.db.Clientes.find_one({
            "$or": [
                {"DNI_cliente": data['DNI_cliente']},
                {"email": data['email']}
            ]
        })
        
        if existing_client:
            return {"contenido": "Este DNI o E-mail ya está registrado"}, 400
        
        hashed_password = generate_password_hash(data['Contraseña'])
        client_data = {
            'nombre': data['nombre'],
            'DNI_cliente': data['DNI_cliente'],
            'nombre_usuario': data['nombre_usuario'],
            'Contraseña': hashed_password,
            'email': data['email'],
            'rol': data.get('rol', 'user')
        }
        
        self.mongo.db.Clientes.insert_one(client_data)
        return {"contenido": "Usuario registrado con éxito"}, 201
    
    def get_usuario_by_username(self, username):
        return self.mongo.db.Clientes.find_one({"nombre_usuario": username})

    def show_clients(self):
        clients = list(self.mongo.db.Clientes.find().sort('_id', -1))
        for item in clients:
            item['_id'] = str(item['_id'])
        response = json_util.dumps(clients)
        return Response(response, mimetype="application/json")

    def specific_client(self, id):
        client = self.mongo.db.Clientes.find_one({'_id': ObjectId(id)})
        response = json_util.dumps(client)
        return Response(response, mimetype="application/json")
    
    def find_client(self, palabra):
        regex = re.compile(f".*{re.escape(palabra)}.*", re.IGNORECASE)
        clients = list(self.mongo.db.Clientes.find({
            "$or": [
                {"nombre": regex},
                {"email": regex},
                {"nombre_usuario": regex}
            ]
        }).sort('_id', -1))
        
        for item in clients:
            item['_id'] = str(item['_id'])
        
        response = json_util.dumps(clients)
        return Response(response, mimetype="application/json")
