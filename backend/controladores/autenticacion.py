from flask import Blueprint, request, jsonify, session, current_app
from werkzeug.security import check_password_hash
from models.modelClient import ClientModel

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    print("lo que tomó del handle submit", data)

    user_data = data.get('user', {})  # Extrae el objeto 'user'
    username = user_data.get('username')
    password = user_data.get('password')

    print("Usuario y contraseña en el backend:", username, password)

    
    client_model = ClientModel(current_app)
    usuario = client_model.get_usuario_by_username(username)
    print("encontramos el usuario en la db" , usuario)
    
    if usuario and str(usuario["nombre_usuario"]) == username and check_password_hash(usuario['Contraseña'], password):
        print("entro al if, el nombre_usuario y el hash concuerda")
        session['user_id'] = str(usuario['_id'])
        session['rol'] = usuario.get('rol', "user") 
        user = {
            "nombre_usuario": usuario["nombre_usuario"],
            "rol": session['rol']
        }
        return jsonify( user), 200
    else:
        print("no concuerda el hash")
        return jsonify({'message': 'Invalid credentials'}), 401
