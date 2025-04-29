import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function useCreateClient() {
  const [registUser, setRegistUser] = useState({
    nombre: '',
    DNI_cliente: '',
    email: '',
    nombre_usuario: '',
    Contraseña: ''
  });

  const [loading, setLoading] = useState(false);
  const [messageCreate, setMessageCreate] = useState('');
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
    const formatted = formatDNI(value);
    setRegistUser((prev) => ({ ...prev, DNI_cliente: formatted }));
  };


  const handleRegister = (event) => {
    event.preventDefault();

    const { nombre, DNI_cliente, email, nombre_usuario, Contraseña } = registUser;

    const data = {
      nombre,
      DNI_cliente,
      email,
      nombre_usuario,
      Contraseña
    };

    setLoading(true);

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
          setMessageCreate('Usuario registrado con éxito!');
          setTimeout(() => navigate("/"), 2000);
        } else {
          setMessageCreate('Error al registrar el usuario: ' + data.contenido);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
        setMessageCreate('Error al registrar el usuario. ' + error.message);
      });
  };

  return { handleRegister, registUser, setRegistUser, handleDNIChange, loading, messageCreate };
}

export default useCreateClient;
