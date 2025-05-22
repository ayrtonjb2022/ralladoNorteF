import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiUserPlus } from "react-icons/fi";
import { getClientes, upDateCliente, deleteCliente } from '../../../api/apiNegocio.js';
import ModalCliente from '../../../components/modal/ModalCliente.jsx';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [clienteEliminar, setClienteEliminar] = useState(null);

  const [formEdit, setFormEdit] = useState({
    id: null,
    nombre_cliente: "",
    apellido_cliente: "",
    direccion_cliente: "",
    contacto_cliente: "",
  });

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await getClientes();
      setClientes(data);
    };
    fetchClientes();
  }, []);

  const handleEditar = (cliente) => {
    setClienteEditar(cliente);
    setFormEdit(cliente);
  };

  const guardarEdicion = () => {
    const nuevos = clientes.map((c) =>
      c.id === formEdit.id ? formEdit : c
    );
    setClientes(nuevos);
    setClienteEditar(null);
    upDateCliente(formEdit.id, formEdit); // Llamada a API
  };

  const handleEliminar = (cliente) => {
    setClienteEliminar(cliente);
  };

  const confirmarEliminacion = () => {
    setClientes(clientes.filter((c) => c.id !== clienteEliminar.id));
    deleteCliente(clienteEliminar.id); 
    setClienteEliminar(null);
  };

  const cancelar = () => {
    setClienteEditar(null);
    setClienteEliminar(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {modalOpen && (
        <ModalCliente onClose={() => setModalOpen(false)} />
      )}

     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Clientes</h1>
  <button
    onClick={() => setModalOpen(true)}
    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
  >
    <FiUserPlus /> Nuevo Cliente
  </button>
</div>


      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-700">
              <th className="p-2">Nombre</th>
              <th className="p-2">Apellido</th>
              <th className="p-2">Dirección</th>
              <th className="p-2">Contacto</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{cliente.nombre_cliente}</td>
                <td className="p-2">{cliente.apellido_cliente}</td>
                <td className="p-2">{cliente.direccion_cliente}</td>
                <td className="p-2">{cliente.contacto_cliente}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleEditar(cliente)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleEliminar(cliente)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Editar Cliente */}
      {clienteEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Editar Cliente</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="nombre_cliente"
                placeholder="Nombre"
                className="w-full border p-2 rounded"
                value={formEdit.nombre_cliente}
                onChange={(e) => setFormEdit({ ...formEdit, nombre_cliente: e.target.value })}
              />
              <input
                type="text"
                name="apellido_cliente"
                placeholder="Apellido"
                className="w-full border p-2 rounded"
                value={formEdit.apellido_cliente}
                onChange={(e) => setFormEdit({ ...formEdit, apellido_cliente: e.target.value })}
              />
              <input
                type="text"
                name="direccion_cliente"
                placeholder="Dirección"
                className="w-full border p-2 rounded"
                value={formEdit.direccion_cliente}
                onChange={(e) => setFormEdit({ ...formEdit, direccion_cliente: e.target.value })}
              />
              <input
                type="text"
                name="contacto_cliente"
                placeholder="Contacto"
                className="w-full border p-2 rounded"
                value={formEdit.contacto_cliente}
                onChange={(e) => setFormEdit({ ...formEdit, contacto_cliente: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={cancelar} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
              <button onClick={guardarEdicion} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {clienteEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">¿Eliminar Cliente?</h2>
            <p className="mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-4">
              <button onClick={cancelar} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={confirmarEliminacion} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
