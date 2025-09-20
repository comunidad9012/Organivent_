from flask_mail import Message
from flask import current_app
from extensiones import mail

def enviar_confirmacion_pedido(email, nombre, pedido_id, total):
    msg = Message(
        subject="📚 Confirmación de tu pedido",
        recipients=[email],
        body=f"""
Hola {nombre},

Tu pedido #{pedido_id} ha sido confirmado.
Monto total: ${total}

¡Gracias por tu compra! 🚀
"""
    )
    mail.send(msg)


def enviar_bienvenida(email, nombre):
    msg = Message(
        subject="🎉 Bienvenida a nuestra librería",
        sender="sofi@gmail.com",
        recipients=[email],
        body=f"Hola {nombre}, gracias por registrarte en nuestra tienda 📚."
    )
    mail.send(msg)
