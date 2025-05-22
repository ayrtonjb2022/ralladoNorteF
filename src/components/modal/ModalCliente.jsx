import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import {newCliente} from "../../api/apiNegocio.js";

export default function ModalCliente() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre_cliente: "",
    apellido_cliente: "",
    direccion_cliente: "",
    contacto_cliente: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = async() => {
    console.log("Datos del cliente:", formData);
    setIsOpen(false);
    // Aquí puedes agregar la lógica para guardar el cliente
    await newCliente(formData);
    //recargar pagina
    window.location.reload();
  };

  return (
    <>
      {/* Botón para abrir modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Registrar Cliente
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Registrar Cliente</h2>

            <div className="space-y-4">
              <input
                type="text"
                name="nombre_cliente"
                placeholder="Nombre"
                value={formData.nombre_cliente}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="apellido_cliente"
                placeholder="Apellido"
                value={formData.apellido_cliente}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="direccion_cliente"
                placeholder="Dirección"
                value={formData.direccion_cliente}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="contacto_cliente"
                placeholder="Contacto (teléfono/email)"
                value={formData.contacto_cliente}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleGuardar}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
