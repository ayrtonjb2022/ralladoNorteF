import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { login } from '../../api/apiAuth.js';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/modal/Message.jsx';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [typeMessage, setTypeMessage] = useState('success');
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(form);
      console.log(response.status);

      if (response.status === 200) {
        setMessage('Inicio de sesión exitoso');
        setTypeMessage('success');
        setShowMessage(true);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMessage('Error al iniciar sesión. Verifica tus credenciales.');
      setTypeMessage('error');
      setShowMessage(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>

        {/* Mensaje arriba del formulario */}
        <Message
          isOpen={showMessage}
          onClose={() => setShowMessage(false)}
          message={message}
          type={typeMessage}
        />

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
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

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition duration-200"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-500">
          ¿No tienes cuenta? <a href="./register" className="text-blue-600 hover:underline">Regístrate</a>
        </div>
      </div>
    </div>
  );
}
