from flask import Blueprint, request, jsonify, session, current_app
from werkzeug.security import check_password_hash
from models.modelClient import ClientModel

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json

    user_data = data.get('user', {})  # Extrae el objeto 'user'
    username = user_data.get('username')
    password = user_data.get('password')

    #aca toma el username y password del frontend
    
    client_model = ClientModel(current_app)
    usuario = client_model.get_usuario_by_username(username)
    #aca encuentra el usuario por username
    
    if usuario and str(usuario["nombre_usuario"]) == username and check_password_hash(usuario['Contraseña'], password):
        session['user_id'] = str(usuario['_id'])
        session['rol'] = usuario.get('rol', "user") 
        user = {
            "nombre_usuario": usuario["nombre_usuario"],
            "rol": session['rol']
        }
        return jsonify( user), 200
    else:
        return jsonify({'message': 'Datos incorrectos'}), 401
