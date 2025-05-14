from flask import Blueprint, request, jsonify, make_response, current_app
from werkzeug.security import check_password_hash #para el hash
from models.modelClient import ClientModel
import jwt #para el token
from datetime import datetime, timedelta  #para definir la expiracion del token

from functools import wraps #para el decorador

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST']) #con esto se logea si el usuario y contraseña son correctos
def login():
    data = request.json

    user_data = data.get('user', {})  # Extrae el objeto 'user'
    username = user_data.get('username')
    password = user_data.get('password')

    #aca toma el username y password del frontend
    
    client_model = ClientModel(current_app)
    usuario = client_model.get_usuario_by_username(username)
    #aca encuentra el usuario por username
    

    if usuario and check_password_hash(usuario['Contraseña'], password):
        payload = {
            'id': str(usuario['_id']),
            'nombre_usuario': usuario['nombre_usuario'],
            'rol': usuario.get('rol', 'user'),
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }
        token = jwt.encode(payload, current_app.secret_key, algorithm='HS256') #codifica el token.  ver si esto no me da error por el secret_key que yo lo tengo difernte

        #acá pongo los datos que quiero que el frontend vea
        user = {
        'id': str(usuario['_id']),
        'nombre_usuario': usuario['nombre_usuario'],
        'rol': usuario['rol']
        }

        response = make_response(user) #make_response crea una respuesta HTTP personalizada, permite modificar cabeceras o agregar cookies
        response.set_cookie('jwt', token, httponly=True, samesite='Strict')

        return response
    else:
        return jsonify({'message': 'Datos incorrectos'}), 401


def token_required(f):  #Middleware de autenticación, decorador | con esto vemos si el token es valido
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('jwt')
        if not token:
            return jsonify({'message': 'Token faltante'}), 401
        try:
            data = jwt.decode(token, current_app.secret_key, algorithms=['HS256']) #descodifica el token
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
        except Exception as e:
            print("Error inesperado en token_required:", str(e))
            return jsonify({'message': 'Error interno en la validación del token'}), 500

        return f(data, *args, **kwargs)
    return decorated

@auth_bp.route('/verificar_jwt', methods=['GET']) #pregunta al backend si el usuario sigue logueado, utiliza el middleware
@token_required
def verificar_usuario(data):
    return jsonify({
        'id': data['id'],
        'nombre_usuario': data['nombre_usuario'],
        'rol': data['rol']
        }), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'message': 'Sesión cerrada'}))
    response.set_cookie('jwt', '', expires=0)
    return response
