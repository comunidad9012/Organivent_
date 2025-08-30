from flask_pymongo import PyMongo
from datetime import datetime

class Descuento:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def obtener_descuentos_activos(self):
        hoy = datetime.now()

        # Asegúrate de que fecha_inicio y fecha_fin están guardadas como ISODate en Mongo
        return list(self.mongo.db.descuentos.find({
            "activo": True,
            "fecha_inicio": {"$lte": hoy},
            "fecha_fin": {"$gte": hoy}
        }))
