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
        subject="🎉 ¡Bienvenida a nuestra librería!",
        recipients=[email],
    )

    # Fallback de texto plano
    msg.body = f"""
Hola {nombre},

¡Gracias por registrarte en nuestra tienda de libros y agendas 📚!

Ahora formas parte de nuestra comunidad.  
Desde hoy recibirás novedades, promociones exclusivas y mucho más.  

¡Esperamos que disfrutes la experiencia! 🚀
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
        margin: 0;
        padding: 0;
        color: #333;
      }}
      .container {{
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }}
      h2 {{
        color: #16a34a;
      }}
      .footer {{
        margin-top: 24px;
        font-size: 14px;
        color: #666;
        text-align: center;
      }}
      .btn {{
        display: inline-block;
        padding: 12px 20px;
        margin-top: 16px;
        background: #16a34a;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
      }}
    </style>
  </head>
  <body>
    <div class="container">
      <h2>🎉 ¡Bienvenida, {nombre}!</h2>
      <p>Gracias por registrarte en nuestra <strong>librería online</strong>. 📚</p>
      <p>Ahora formas parte de nuestra comunidad, donde podrás acceder a:</p>
      <ul>
        <li>✨ Novedades de libros y agendas</li>
        <li>💸 Promociones exclusivas</li>
        <li>🚀 Experiencias personalizadas</li>
      </ul>
      
      <a href="http://localhost:5173/home" class="btn">Explorar la tienda</a>

      <div class="footer">
        <p>Organivent Librería - Todos los derechos reservados</p>
      </div>
    </div>
  </body>
</html>
"""

    mail.send(msg)

def enviar_actualizacion_estado(email, nombre, pedido_id, nuevo_estado):
    msg = Message(
        subject=f"📦 Actualización de tu pedido #{pedido_id}",
        recipients=[email],
    )

    # Texto plano
    msg.body = f"""
Hola {nombre},

Tu pedido #{pedido_id} ha cambiado de estado.  
Nuevo estado: {nuevo_estado} ✅

Te mantendremos informada sobre cualquier novedad.  

¡Gracias por confiar en nuestra librería! 📚
"""

    # HTML embellecido
    msg.html = f"""
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {{
        font-family: Arial, sans-serif;
        background-color: #f9fafb;
        margin: 0;
        padding: 0;
        color: #333;
      }}
      .container {{
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }}
      h2 {{
        color: #2563eb;
      }}
      .estado {{
        font-size: 18px;
        font-weight: bold;
        color: #2563eb;
      }}
      .footer {{
        margin-top: 24px;
        font-size: 14px;
        color: #666;
        text-align: center;
      }}
    </style>
  </head>
  <body>
    <div class="container">
      <h2>📦 Actualización de tu pedido #{pedido_id}</h2>
      <p>Hola <strong>{nombre}</strong>,</p>
      <p>Tu pedido ha cambiado de estado.</p>
      <p class="estado">➡️ Nuevo estado: {nuevo_estado}</p>
      
      <p>Te avisaremos de cualquier otra novedad.  
      ¡Gracias por confiar en <strong>nuestra librería</strong>! 📚</p>

      <div class="footer">
        <p>Organivent Librería - Todos los derechos reservados</p>
      </div>
    </div>
  </body>
</html>
"""

    mail.send(msg)

