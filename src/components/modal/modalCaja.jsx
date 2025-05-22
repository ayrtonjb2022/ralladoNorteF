import React, { useState } from 'react';

const ModalCrearCaja = ({ isOpen, onClose, onCreate }) => {
  const [saldoInicial, setSaldoInicial] = useState('');
  const fechaArgentina = new Date().toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const [dia, mes, anio] = fechaArgentina.split('/');
  const fechaFormateada = `${anio}-${mes}-${dia}`;

  if (!isOpen) return null;

  const handleCreate = () => {
    onCreate({ saldo_inicial:saldoInicial });
    onClose();

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h1 className="text-xl font-bold mb-4 text-center">Crear Caja - {fechaFormateada}</h1>

        <label className="block text-gray-700 mb-2">Saldo Inicial:</label>
        <input
          type="number"
          value={saldoInicial}
          onChange={(e) => setSaldoInicial(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          placeholder="Ingrese el saldo inicial"
        />

        <div className="flex justify-end gap-3">
        
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCrearCaja;
