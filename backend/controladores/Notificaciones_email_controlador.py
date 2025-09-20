from flask_mail import Message
from flask import current_app
from extensiones import mail

def enviar_confirmacion_pedido(email, nombre, pedido_id, total):
    msg = Message(
        subject="📚 Confirmación de tu pedido",
        recipients=[email],
    )

    # Texto plano (fallback)
    msg.body = f"""
Hola {nombre},

Tu pedido #{pedido_id} ha sido recibido y está siendo procesado.
Monto total: ${total}

En breve nos pondremos en contacto contigo por este mismo correo para coordinar el pago y la entrega.  

¡Muchas gracias por elegirnos! 🚀
"""

    # Versión HTML
    msg.html = f"""
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {{
        font-family: Arial, sans-serif;
        background-color: #f9fafb;
        color: #333;
        margin: 0;
        padding: 0;
      }}
      .container {{
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }}
      h2 {{
        color: #4f46e5;
      }}
      .pedido {{
        background: #f3f4f6;
        border-radius: 8px;
        padding: 12px;
        margin: 16px 0;
      }}
      .footer {{
        margin-top: 20px;
        font-size: 14px;
        color: #666;
        text-align: center;
      }}
    </style>
  </head>
  <body>
    <div class="container">
      <h2>📚 Confirmación de tu pedido</h2>
      <p>Hola <strong>{nombre}</strong>,</p>
      <p>Tu pedido ha sido recibido y está siendo procesado. En breve nos pondremos en contacto contigo por este mismo correo para coordinar el pago y la entrega.</p>
      
      <div class="pedido">
        <p><strong>Número de pedido:</strong> {pedido_id}</p>
        <p><strong>Monto total:</strong> ${total}</p>
      </div>

      <p>¡Muchas gracias por elegirnos! 🚀</p>
      <div class="footer">
        <p>Organivent Librería - Todos los derechos reservados</p>
      </div>
    </div>
  </body>
</html>
"""

    mail.send(msg)


def enviar_bienvenida(email, nombre):
    msg = Message(
        subject="🎉 Bienvenida a nuestra librería",
        sender="sofi@gmail.com",
        recipients=[email],
        body=f"Hola {nombre}, gracias por registrarte en nuestra tienda 📚."
    )
    mail.send(msg)
