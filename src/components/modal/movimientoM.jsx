import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { getClientes } from '../../api/apiNegocio.js';

const ModalMovimientos = ({ onClose, onSubmit, type }) => {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [cliente, setCliente] = useState('');
  const [clientes, setClientes] = useState([]); 
  const [kilosV, setKilosV] = useState('');

  const handleSubmit = (e) => {
    console.log("cliente:",cliente);
    
    e.preventDefault();
    const movimiento = {
      tipo: type,
      fecha: new Date().toLocaleString('sv-SE', {
        timeZone: 'America/Argentina/Buenos_Aires',
      }).replace(' ', 'T'),
      monto: parseFloat(monto),
      descripcion,
      categoria,
      cliente_id:cliente,
      kilosV
    };
    onSubmit(movimiento);
    onClose();
  };

  useEffect(() => {
    const getAllClientes = async () => {
      try {
        const response = await getClientes();
        setClientes(response); // ✅ debe ser array
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      }
    };

    getAllClientes();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black">
          <AiOutlineClose size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Nuevo Movimiento</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>
          {type === 'ingreso' && (
            <div>
            <label className="block text-sm font-medium text-gray-700">Kilos vendidos</label>
            <input
              type="number"
              value={kilosV}
              onChange={(e) => setKilosV(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="Mercaderia">Mercaderia</option>
              <option value="Empleados">Empleados</option>
              <option value="Servicios">Servicios</option>
              <option value="Otros">Otros</option>
              <option value="Combustible">Combustible</option>
            </select>
          </div>

          {type === 'ingreso' && (
                      <div>
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
            <select
              value={cliente}
              onChange={(e) => setCliente(e.target.value)} // ✅ se corrige setCategoria -> setCliente
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
              required
            >
              <option value="">Seleccione un Cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.apellido_cliente} -- {cliente.nombre_cliente}
                </option>
              ))}
            </select>
          </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Guardar Movimiento
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalMovimientos;
