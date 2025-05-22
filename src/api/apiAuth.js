// src/services/apiNegocio.js
import axios from 'axios';

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada request si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // suponiendo que guardaste el token así
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const login = async (data)=>{
  try {
    const response = await api.post('/login', data);
    const token = response.data.token;
    console.log(response);
    
    sessionStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
}

export const register = async (data)=>{
  try {
    const response = await api.post('/register', data);
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
}