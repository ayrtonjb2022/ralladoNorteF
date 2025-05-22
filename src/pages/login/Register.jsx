import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { register } from '../../api/apiAuth.js';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.repeatPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }


    const response = await register(form);
    if (response) navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear Cuenta</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div className="flex items-center border rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 ring-blue-400">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              className="outline-none flex-1 text-sm"
              required
            />
          </div>

          {/* Apellido */}
          <div className="flex items-center border rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 ring-blue-400">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              className="outline-none flex-1 text-sm"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 ring-blue-400">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="outline-none flex-1 text-sm"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="flex items-center border rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 ring-blue-400">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="outline-none flex-1 text-sm"
              required
            />
            <button type="button" onClick={togglePassword} className="text-gray-500 hover:text-gray-800">
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>

          {/* Repetir Contraseña */}
          <div className="flex items-center border rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 ring-blue-400">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="repeatPassword"
              placeholder="Repetir contraseña"
              value={form.repeatPassword}
              onChange={handleChange}
              className="outline-none flex-1 text-sm"
              required
            />
          </div>

          {/* Botón registrar */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition duration-200"
          >
            Registrarse
          </button>
        </form>

        {/* Enlace a login */}
        <div className="mt-4 text-sm text-center text-gray-500">
          ¿Ya tienes cuenta? <a href="/login" className="text-blue-600 hover:underline">Inicia sesión</a>
        </div>
      </div>
    </div>
  );
}
