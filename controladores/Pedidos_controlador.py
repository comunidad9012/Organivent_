from flask import Blueprint, request, current_app, jsonify
from models.modelPedidos import PedidosModel

Pedidos_bp = Blueprint('Pedidos', __name__, url_prefix='/Pedidos')

@Pedidos_bp.post("/createPedido")
def create_pedido():
    data = request.json
    print("Datos recibidos en createPedido:", data)  # <-- Esto es clave
    pedidos_model = PedidosModel(current_app)
    response = pedidos_model.create_pedido(data)
    return response

@Pedidos_bp.get("/showPedidos")
def show_pedidos():
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
