# Blueprint: Permite crear módulos separados para diferentes partes de la aplicación.
# request: Para acceder a los datos enviados en las solicitudes HTTP.
# current_app: Hace referencia a la aplicación Flask activa.

from flask import Blueprint, request, current_app, jsonify
from models.modelProductos import ProductosModel
from models.modelDescuentos import Descuento
from utils.descuentos import aplicar_descuentos_a_productos, validar_descuento
from bson import ObjectId
from models.modelVariantes import VariantesModel
from models.modelStock import StockModel
from utils.serializers import serialize_doc

Productos_bp = Blueprint('Productos', __name__, url_prefix='/Productos')

@Productos_bp.post("/createProductos")
def create_Productos():
    data = request.json  #Obtiene los datos enviados en la solicitud como un diccionario JSON.
    Productos_model = ProductosModel(current_app)  #Instancia el modelo de productos, conectándolo con la aplicación Flask activa.
    response = Productos_model.create_Productos(data) #Llama al método del modelo para crear el producto con los datos proporcionados.
    return jsonify(response) #Devuelve la respuesta al cliente (front en react).

# arreglar que si o si tiene que tener contenido el producto para crearlo.

@Productos_bp.delete("/deleteProductos/<id>")
def delete_product(id):
    Productos_model = ProductosModel(current_app)
    success = Productos_model.delete_product_by_id(id)
    if success:
        return jsonify({"message": "Producto eliminado con éxito"}), 200
    else:
        return jsonify({"error": "No se encontró el producto"}), 404


@Productos_bp.get("/showProductos")
def show_Productos():
    Productos_model = ProductosModel(current_app)
    Descuento_model = Descuento(current_app)

    productos = Productos_model.show_Productos().get_json()
    descuentos = Descuento_model.obtener_descuentos_activos()
    # Normalizar todos los descuentos antes de aplicar
    descuentos_normalizados = [validar_descuento(d) for d in descuentos]

    productos = aplicar_descuentos_a_productos(productos, descuentos_normalizados)

    return jsonify(productos)




# @Productos_bp.get("/showProductos")
# def show_Productos():
#     Productos_model = ProductosModel(current_app)
#     Descuento_model = Descuento(current_app)

#     # Traemos productos y descuentos activos
#     response = Productos_model.show_Productos()  # esto es un Response
#     productos = response.get_json()
#     descuentos = Descuento_model.obtener_descuentos_activos()

#     # Convertimos lista de descuentos a algo más fácil de buscar
#     descuentos_por_producto = {}
#     descuentos_por_categoria = {}

#     for d in descuentos:
#         for pid in d.get("productos", []):
#             descuentos_por_producto[str(pid)] = d  # aseguramos string
#         for cat in d.get("categorias", []):
#             descuentos_por_categoria[str(cat)] = d  # aseguramos string

#     # Aplicar descuentos al precio de cada producto
#     for p in productos:
#         # ✅ precio_venta puede venir como string → lo casteamos
#         precio_original = float(p.get("precio_venta", 0))

#         # ✅ convertimos _id y categoria a string
#         p["_id"] = str(p["_id"])
#         p["categoria"] = str(p.get("categoria", ""))

#         precio_final = precio_original
#         descuento_aplicado = None

#         # 1️⃣ Descuento por producto
#         if p["_id"] in descuentos_por_producto:
#             d = descuentos_por_producto[p["_id"]]
#             if d["tipo"] == "porcentaje":
#                 precio_final = precio_original * (1 - d["valor"])
#             elif d["tipo"] == "fijo":
#                 precio_final = max(precio_original - d["valor"], 0)
#             descuento_aplicado = d

#         # 2️⃣ Descuento por categoría
#         elif p["categoria"] in descuentos_por_categoria:
#             d = descuentos_por_categoria[p["categoria"]]
#             if d["tipo"] == "porcentaje":
#                 precio_final = precio_original * (1 - d["valor"])
#             elif d["tipo"] == "fijo":
#                 precio_final = max(precio_original - d["valor"], 0)
#             descuento_aplicado = d

#         # Guardamos en la respuesta
#         p["precio_original"] = round(precio_original, 2)
#         p["precio_final"] = round(precio_final, 2)
#         if descuento_aplicado:
#             p["descuento_aplicado"] = {
#                 "nombre": descuento_aplicado["nombre"],
#                 "tipo": descuento_aplicado["tipo"],
#                 "valor": descuento_aplicado["valor"]
#             }

#     return jsonify(productos)





#     Bonus

# Esto mismo lo podés replicar en:

# viewProductos/<id> → mostrar un producto con su descuento aplicado.

# showProductosPorCategoria/<id_categoria> → ya traer con descuentos.


# @Productos_bp.get("/viewProductos/<id>")
# def specific_product(id):
#     Productos_model=ProductosModel(current_app)
#     response=(Productos_model.specific_product(id)).json
#     return response

@Productos_bp.get("/viewProductos/<id>")
def specific_product_endpoint(id):
    Productos_model = ProductosModel(current_app)
    Variantes_model = VariantesModel(current_app)
    Stock_model = StockModel(current_app)
    Descuento_model = Descuento(current_app)

    producto = Productos_model.specific_product(id)
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404

    # Validar ObjectId
    try:
        producto_oid = ObjectId(id)
    except:
        return jsonify({"error": "ID inválido"}), 400

    # Buscar variantes del producto
    variantes = list(Variantes_model.mongo.db.Variantes.find({"producto_id": producto_oid}))

    # Para cada variante, agregar stock
    for v in variantes:
        stock_doc = Stock_model.get_stock_by_variante(v["_id"])
        v["stock"] = stock_doc["cantidad"] if stock_doc else 0

    producto["variantes"] = variantes

    # Aplicar descuentos
    descuentos = Descuento_model.obtener_descuentos_activos()
    producto_con_descuento = aplicar_descuentos_a_productos([producto], descuentos)[0]

    # Serializar todo antes de devolverlo
    return jsonify(serialize_doc(producto_con_descuento)), 200


@Productos_bp.post("/find_product") #cambie por post para poder usar el formulario, si lo puedo arreglar la vuelvo a get
def find_product():
    data=request.json
    palabra = data['palabra'] 
    Productos_model = ProductosModel(current_app)
    response = Productos_model.find_Productos(palabra=palabra)
    return response

# @Productos_bp.get("/showProductosPorCategoria/<id_categoria>")
# def get_productos_por_categoria(id_categoria):
#     id_categoria = id_categoria.replace("%20", " ")  # Decodifica espacios si es necesario
#     print("Categoría recibida:", id_categoria)  # Debug en consola
#     Productos_model = ProductosModel(current_app)#saque current_app.mongo.db  //posible problemita con Productos
#     response = Productos_model.get_productos_by_categoria(id_categoria) #----------
#     return response


@Productos_bp.get("/showProductosPorCategoria/<id_categoria>")
def get_productos_por_categoria(id_categoria):
    id_categoria = id_categoria.replace("%20", " ")
    Productos_model = ProductosModel(current_app)
    Descuento_model = Descuento(current_app)

    productos = Productos_model.get_productos_by_categoria(id_categoria).get_json()
    descuentos = Descuento_model.obtener_descuentos_activos()

    productos = aplicar_descuentos_a_productos(productos, descuentos)
    return jsonify(productos)


@Productos_bp.put("/update/<id>")
def update_product(id):
    data = request.json  # Obtiene los datos enviados en la solicitud como JSON.
    Productos_model = ProductosModel(current_app)  # Instancia el modelo de productos.
    response = Productos_model.update_product(id, data)  # Llama al método del modelo.
    return response  # Devuelve la respuesta.

#IMPLEMENTAR DESPUES CUANDO TENGA LA VISTA EN EL FORMULARIO

# @Productos_bp.put("/update/<id>")
# def update_product(id):
#     data = request.json
#     Productos_model = ProductosModel(current_app)
#     Descuento_model = Descuento(current_app)

#     response = Productos_model.update_product(id, data)
#     producto_actualizado = response.get_json()
#     descuentos = Descuento_model.obtener_descuentos_activos()
#     producto_actualizado = aplicar_descuentos_a_productos([producto_actualizado], descuentos)[0]

#     return jsonify(producto_actualizado)

@Productos_bp.get("/es_favorito/<product_id>")
def es_favorito(product_id):
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"error": "user_id es requerido"}), 400

        Productos_model = ProductosModel(current_app)
        result = Productos_model.is_favorito(user_id, product_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@Productos_bp.post("/toggle_favorito/<product_id>")
def toggle_favorito(product_id):
    try:
        data = request.json
        user_id = data.get("user_id")

        if not user_id:
            return jsonify({"error": "user_id es requerido"}), 400

        Productos_model = ProductosModel(current_app)
        result = Productos_model.toggle_favorito(user_id, product_id)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@Productos_bp.route('/favoritos/<user_id>', methods=['GET'])
def get_favoritos(user_id):
    try:
        Productos_model = ProductosModel(current_app)  #ahora instanciado
        response = Productos_model.get_favoritos(user_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
