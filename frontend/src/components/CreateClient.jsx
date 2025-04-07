import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function CreateClient() {
  const [nombre, setNombre] = useState('');
  const [DNI_cliente, setDNICliente] = useState('');
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [Contraseña, setContraseña] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const formatDNI = (value) => {
    const cleanValue = value.replace(/\D/g, ''); // Elimina todo lo que no sea un dígito
    let formattedDNI = '';
    
    if (cleanValue.length > 2) {
      formattedDNI += cleanValue.slice(0, 2) + '.';
    } else {
      formattedDNI += cleanValue;
    }

    if (cleanValue.length > 5) {
      formattedDNI += cleanValue.slice(2, 5) + '.';
    } else if (cleanValue.length > 2) {
      formattedDNI += cleanValue.slice(2);
    }

    if (cleanValue.length > 7) {
      formattedDNI += cleanValue.slice(5, 8);
    } else if (cleanValue.length > 5) {
      formattedDNI += cleanValue.slice(5);
    }

    return formattedDNI;
  };

  const handleDNIChange = (e) => {
    const value = e.target.value;
    setDNICliente(formatDNI(value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      nombre,
      DNI_cliente,
      nombre_usuario,
      Contraseña,
      email
    };

    setLoading(true);

    //ver de poner un UseEffect
    fetch('http://localhost:5000/Client/createClient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      setLoading(false);
      if (data.contenido === "Usuario registrado con éxito") {
        setMessage('Usuario registrado con éxito!');
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage('Error al registrar el usuario: ' + data.contenido);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setLoading(false);
      setMessage('Error al registrar el usuario.' + error); //si el error juju da error es error.message
    });
  };

  return (
    <div>
      <Helmet>
        <title>¡Crea tu cuenta!</title>
      </Helmet>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="container text-center col-md-8 mt-4 mb-4">
          <label htmlFor="nombre"><h5>Nombre</h5></label>
          <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <label htmlFor="DNI_cliente"><h5>DNI</h5></label>
          <input type="text" className="form-control" id="DNI_cliente" value={DNI_cliente} onChange={handleDNIChange} required />
          <label htmlFor="nombre_usuario"><h5>Nombre de Usuario</h5></label>
          <input type="text" className="form-control" id="nombre_usuario" value={nombre_usuario} onChange={(e) => setNombreUsuario(e.target.value)} required />
          <label htmlFor="Contraseña"><h5>Contraseña</h5></label>
          <input type="password" className="form-control" id="Contraseña" value={Contraseña} onChange={(e) => setContraseña(e.target.value)} required />
          <label htmlFor="email"><h5>E-mail</h5></label>
          <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="container text-center mt-2">
          {!loading && (
            <button type="submit" className="btn btn-success">
              Crear cuenta
            </button>
          )}
        </div>
        {loading && 
          <div className="banter-loader">
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
          </div>
        }
      </form>
    </div>
  );
}

export default CreateClient;
