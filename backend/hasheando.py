import bcrypt
from pymongo import MongoClient

# Conectar a MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["Tienda"]
clientes_collection = db["Clientes"]

# Función para hashear contraseñas
def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

# Actualizar todas las contraseñas
for cliente in clientes_collection.find():
    if "Contraseña" in cliente:
        hashed_password = hash_password(cliente["Contraseña"])
        clientes_collection.update_one(
            {"_id": cliente["_id"]},
            {"$set": {"Contraseña": hashed_password}}
        )

print("✅ Contraseñas encriptadas correctamente.")


# hermoso pero al final utilicé otro metodo de encriptación en el back jeje ups

# yo borraria esto si total tampoco vamos a saber las contraseñas de los usuarios