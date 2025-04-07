import os
from dotenv import load_dotenv
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_pymongo import PyMongo
from controladores.Client_controlador import Client_bp
from controladores.Productos_controlador import Productos_bp
from controladores.img_controlador import imgs_bp
from controladores.Categoria_controlador import Categoria_bp
from controladores.autenticacion import auth_bp

load_dotenv()

app = Flask(__name__, static_folder='../images', static_url_path='/images')
CORS(app)

app.config['MONGO_URI'] = os.getenv('MONGOURL')
app.secret_key = os.getenv("SECRET_KEY")
mongo = PyMongo(app)  # Esto debería configurar mongo correctamente

app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), '../images')
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['Access-Control-Allow-Credentials'] = "true"

app.register_blueprint(Client_bp)
app.register_blueprint(Productos_bp)
app.register_blueprint(imgs_bp)
app.register_blueprint(Categoria_bp)
app.register_blueprint(auth_bp)

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=True)
