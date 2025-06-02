from models.modelClient import ClientModel
from flask import Response
from bson import json_util, ObjectId
import re

class AdminModel(ClientModel):
    def __init__(self, app):
        super().__init__(app)

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
