from flask_pymongo import PyMongo
from datetime import datetime
from bson.objectid import ObjectId


class Descuento:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def crear_descuento(self, data):
        # productos y categorias se guardan como strings
        productos = [str(p) for p in data.get("productos", [])]
        categorias = [str(c) for c in data.get("categorias", [])]

        # convertir fechas ISO a datetime (Mongo luego las guarda como $date)
        fecha_inicio = (
            datetime.fromisoformat(data["fecha_inicio"].replace("Z", "+00:00"))
            if "fecha_inicio" in data else None
        )
        fecha_fin = (
            datetime.fromisoformat(data["fecha_fin"].replace("Z", "+00:00"))
            if "fecha_fin" in data else None
        )

        descuento_doc = {
            "nombre": data.get("nombre"),
            "tipo": data.get("tipo"),
            "valor": float(data.get("valor", 0)),
            "productos": productos,
            "categorias": categorias,
            "activo": data.get("activo", True),
            "fecha_inicio": fecha_inicio,
            "fecha_fin": fecha_fin,
        }

        result = self.mongo.db.descuentos.insert_one(descuento_doc)
        return str(result.inserted_id)

    # def obtener_descuentos_activos(self):
    #     hoy = datetime.now()
    #     return list(self.mongo.db.descuentos.find({
    #         "activo": True,
    #         "fecha_inicio": {"$lte": hoy},
    #         "fecha_fin": {"$gte": hoy}
    #     }))

    def obtener_descuentos_activos(self):
        hoy = datetime.now()
        descuentos = list(self.mongo.db.descuentos.find({
            "activo": True,
            "fecha_inicio": {"$lte": hoy},
            "fecha_fin": {"$gte": hoy}
        }))

        for d in descuentos:
            # Productos
            if "productos" in d and d["productos"]:
                productos = self.mongo.db.Productos.find(
                    {"_id": {"$in": [ObjectId(pid) for pid in d["productos"]]}}
                )
                d["productos_detalle"] = [
                    {"_id": str(p["_id"]), "nombre": p.get("nombre_producto")}
                    for p in productos
                ]
            # Categorías
            if "categorias" in d and d["categorias"]:
                categorias = self.mongo.db.Categoria.find(
                    {"_id": {"$in": [ObjectId(cid) for cid in d["categorias"]]}}
                )
                d["categorias_detalle"] = [
                    {"_id": str(c["_id"]), "nombre": c.get("nombre_categoria")}
                    for c in categorias
                ]
        return descuentos


    def obtener_todos_con_detalles(self):
        descuentos = list(self.mongo.db.descuentos.find({}))

        for d in descuentos:
            # Obtener productos por id
            if "productos" in d and d["productos"]:
                productos = self.mongo.db.Productos.find(
                    {"_id": {"$in": [ObjectId(pid) for pid in d["productos"]]}}
                )
                d["productos_detalle"] = [
                    {"_id": str(p["_id"]), "nombre": p.get("nombre_producto")}
                    for p in productos
                ]

            # Obtener categorias por id
            if "categorias" in d and d["categorias"]:
                categorias = self.mongo.db.Categoria.find(
                    {"_id": {"$in": [ObjectId(cid) for cid in d["categorias"]]}}
                )
                d["categorias_detalle"] = [
                    {"_id": str(c["_id"]), "nombre": c.get("nombre_categoria")}
                    for c in categorias
                ]
        return descuentos

    def eliminar(self, id):
        result = self.mongo.db.descuentos.delete_one({"_id": ObjectId(id)})
        return result.deleted_count == 1

    def actualizar(self, id, data):
        result = self.mongo.db.descuentos.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        return result.matched_count == 1
