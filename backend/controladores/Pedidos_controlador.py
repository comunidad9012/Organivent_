from flask import Blueprint, request, current_app, jsonify, session
from models.modelPedidos import PedidosModel
from models.modelClient import ClientModel
from controladores.autenticacion import token_required

Pedidos_bp = Blueprint('Pedidos', __name__, url_prefix='/Pedidos')

@Pedidos_bp.post("/createPedido")
def create_pedido():
    data = request.json
    pedidos_model = PedidosModel(current_app)
    response = pedidos_model.create_pedido(data)
    return response

@Pedidos_bp.get("/showPedidos")
@token_required
def show_pedidos(data):  # data viene del token decodificado
    if data.get('rol') != 'admin':
        return jsonify({"error": "Acceso denegado"}), 403

    pedidos_model = PedidosModel(current_app)
    response = pedidos_model.show_pedidos()
    return response


@Pedidos_bp.get("/viewPedido/<id>")
def view_pedido(id):
    pedidos_model = PedidosModel(current_app)
    response = pedidos_model.get_pedido_by_id(id)
    return response

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