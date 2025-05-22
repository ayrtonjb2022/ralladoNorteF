// src/services/apiNegocio.js
import axios from 'axios';

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: 'https://ralladonorte.onrender.com/api', // ajusta la URL a la de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
  
});

// Interceptor para agregar el token a cada request si existe
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token'); // suponiendo que guardaste el token así
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Funciones para acceder a recursos
export const getCajas = async () => {
  try {
    const response = await api.get('/cajas');
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener cajas:', error);
    throw error;
  }
};



export const getMovimiento = async () => {
  try {
    const response = await api.get('/movimiento');
    return response.data;
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    throw error;
  }
};
export const getAllVentas = async () => {
  try {
    const response = await api.get('/movimiento/ventas');
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    throw error;
  }
};

export const getClientes = async () => {
  try {
    const response = await api.get('/clientes');
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
};

export const getUsuario = async () => {
  try {
    const response = await api.get('/user/me'); 
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};

export const descargarReportePDF = async (fechaInicio, tipo) => {
  try {
    const response = await api.post('/generar-pdf', 
      { fechaInicio, tipo }, 
      { responseType: 'blob' }  // IMPORTANTE para recibir el PDF como blob
    );

    // Crear un URL para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error al descargar PDF:', error);
    throw error;
  }
};

export const newMovimiento = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0)  throw new Error('No se proporcionaron datos para crear el movimiento.');
    
    const response = await api.post('/movimiento', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    throw error;
  }
};


export const newCaja = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0)  throw new Error('No se proporcionaron datos para crear la caja.');
    console.log(data);
    
    const response = await api.post('/cajas', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear caja:', error);
    throw error;
  }
};

export const upDateCaja = async (id, data) => {
  try {
    if (!data || Object.keys(data).length === 0)  throw new Error('No se proporcionaron datos para actualizar la caja.');
    
    const response = await api.put(`/caja/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar caja:', error);
    throw error;
  }
};

export const newCliente = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0)  throw new Error('No se proporcionaron datos para crear el cliente.');
    
    const response = await api.post('/clientes', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear cliente:', error);
    throw error;
  }
};
export const upDateCliente = async (id, data) => {
  try {
    if (!data || Object.keys(data).length === 0)  throw new Error('No se proporcionaron datos para actualizar el cliente.');
    
    const response = await api.put(`/cliente/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    throw error;
  }
};

export const deleteCliente = async (id) => {
  try {
    const response = await api.delete(`/cliente/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    throw error;
  }
}

export const userUpdate = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0)  throw new Error('No se proporcionaron datos para actualizar el usuario.');
    
    const response = await api.put(`/user/update`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}

export const deleteUser = async () => {
  try {
    const response = await api.put(`/user/delete`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}
export const upDatePassword = async (data) => {
  try {
    console.log(data);
    const response = await api.put(`/user/upDatePassword`, data);
    
    
    return response.data;
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    throw error;
  }
}

export const delMovimiento = async (id) => {
  console.log(id);
  
  try {
    const response = await api.delete(`/movimiento/${id}`);
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error('Error al eliminar movimiento:', error);
    throw error;
  }
}