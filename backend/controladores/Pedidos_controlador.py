from flask import Blueprint, request, current_app, jsonify, session, Response
from models.modelPedidos import PedidosModel
from models.modelClient import ClientModel
from controladores.autenticacion import token_required
from bson import json_util
from controladores.Notificaciones_email_controlador import enviar_confirmacion_pedido


Pedidos_bp = Blueprint('Pedidos', __name__, url_prefix='/Pedidos')

@Pedidos_bp.post("/createPedido")
def create_pedido():
    data = request.json
    pedidos_model = PedidosModel(current_app)
    response = pedidos_model.create_pedido(data)

    # Si se creó bien el pedido, mandamos mail
    if "pedido_id" in response and response.get("cliente_email"):
        enviar_confirmacion_pedido(
            response["cliente_email"],
            response.get("cliente_nombre", "Cliente"),
            response["pedido_id"],
            response["total"]
        )
    print("📦 response del modelo:", response)

    return response

@Pedidos_bp.get("/showPedidos")
@token_required
def show_pedidos(data): #data viene del token decodificado
    pedidos_model = PedidosModel(current_app)

    if data.get('rol') == 'admin':
        return pedidos_model.show_pedidos() # Devuelve todos los pedidos
    else:
        return pedidos_model.show_pedidos_by_user(data["id"]) # Devuelve los pedidos del usuario autenticado


@Pedidos_bp.get("/viewPedido/<id>")
@token_required
def view_pedido(data, id):
    pedidos_model = PedidosModel(current_app)

     # 1️⃣ Obtener sin serializar
    pedido_raw = pedidos_model.get_pedido_by_id_raw(id)
    if not pedido_raw:
        return jsonify({"error": "Pedido no encontrado"}), 404

    # 2️⃣ Validar permisos
    if data.get('rol') != 'admin' and str(pedido_raw.get("usuarioId")) != data["id"]:
        return jsonify({"error": "Acceso denegado"}), 403

    # 3️⃣ Serializar y devolver
    pedido_serializado = pedidos_model._serialize_pedido(pedido_raw)
    return Response(json_util.dumps(pedido_serializado), mimetype="application/json")


@Pedidos_bp.delete("/deletePedido/<id>")
def delete_pedido(id):
    pedidos_model = PedidosModel(current_app)
    success = pedidos_model.delete_pedido(id)
    if success:
        return jsonify({"mensaje": "Pedido eliminado con éxito"}), 200
    else:
        return jsonify({"error": "No se encontró el pedido"}), 404

@Pedidos_bp.put("/updatePedido/<id>")
def update_pedido(id):
    data = request.json
    pedidos_model = PedidosModel(current_app)
    response = pedidos_model.update_pedido(id, data)
    return response

@Pedidos_bp.put("/updateState/<id>")
@token_required
def update_state(token_data, id):
    json_data = request.json
    nuevo_estado = json_data.get("nuevo_estado")

    if token_data.get('rol') != 'admin':
        return jsonify({"error": "Acceso denegado"}), 403

    if not nuevo_estado:
        return jsonify({"error": "Estado nuevo no proporcionado"}), 400

    try:
        pedidos_model = PedidosModel(current_app)
        pedido_actual = pedidos_model.get_pedido_by_id_raw(id)

       # Si el resultado es un Response (por ejemplo, jsonify({...})), extraé el JSON
        if isinstance(pedido_actual, Response):
            pedido_actual = pedido_actual.get_json()

        if not pedido_actual:
            return jsonify({"error": "Pedido no encontrado"}), 404

        if pedido_actual["estado"] == nuevo_estado:
            return jsonify({"mensaje": "El estado ya es el mismo. No se realizaron cambios."}), 200

        pedidos_model.update_state(id, nuevo_estado) 
        return jsonify({"mensaje": "Estado actualizado correctamente"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
