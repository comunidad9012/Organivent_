import os #para acceder a las variables de entorno .env
from dotenv import load_dotenv
from extensiones import mail 
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_pymongo import PyMongo

from controladores.Client_controlador import Client_bp
from controladores.Productos_controlador import Productos_bp
from controladores.img_controlador import imgs_bp
from controladores.Categoria_controlador import Categoria_bp
from controladores.autenticacion import auth_bp
from controladores.Pedidos_controlador import Pedidos_bp 
from controladores.descuentos_controlador import Descuentos_bp
from controladores.Variantes_controlador import Variantes_bp
from controladores.Stock_controlador import Stock_bp
from utils.minio_client import client

load_dotenv()

app = Flask(__name__, static_folder='../images', static_url_path='/images')
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}}) # Esto hace que soporte las credenciales (que vienen en header de las peticiones http) y el origen de la app frontend puerto 5173 de vite para poder ver las cookies

app.config['MONGO_URI'] = os.getenv('MONGOURL')
app.secret_key = os.getenv("SECRET_KEY")
mongo = PyMongo(app)  # Esto debería configurar mongo correctamente
try:
    mongo.cx.server_info()  # Esto lanza error si no puede conectar
    print("✅ Conexión a MongoDB exitosa.")
except Exception as e:
    print("❌ Error al conectar con MongoDB:", e)

# Configuración imágenes
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), '../images')
app.config['CORS_HEADERS'] = 'Content-Type'   

# Configuración del servidor de correo (SMTP)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_USERNAME")
# 👇 Inicializar extensión Mail con la app
mail.init_app(app)

app.register_blueprint(Client_bp)
app.register_blueprint(Productos_bp)
app.register_blueprint(imgs_bp)
app.register_blueprint(Categoria_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(Pedidos_bp)
app.register_blueprint(Descuentos_bp)
app.register_blueprint(Variantes_bp)
app.register_blueprint(Stock_bp)

from flask_mail import Message
from extensiones import mail

@app.route("/test-mail")
def test_mail():
    msg = Message(
        subject="Prueba Flask-Mail",
        recipients=["sofisandobal10@gmail.com"],
        body="🚀 Si ves esto, Flask-Mail está funcionando!"
    )
    mail.send(msg)
    return "Correo enviado!"


@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000) #Esto permite que otros contenedores como frontend o tu navegador accedan a Flask.
