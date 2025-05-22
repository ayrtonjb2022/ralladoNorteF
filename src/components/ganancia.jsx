import React, { useState } from 'react';

const Ganancia = () => {
  const [monto, setMonto] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [ganancia, setGanancia] = useState(null);

  const calcularGanancia = () => {
    const montoNum = parseFloat(monto);
    const porcentajeNum = parseFloat(porcentaje);

    if (!isNaN(montoNum) && !isNaN(porcentajeNum)) {
      const gananciaCalculada = montoNum * (porcentajeNum / 100);
      setGanancia(gananciaCalculada.toFixed(2));
    } else {
      setGanancia(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Análisis de Ganancia</h2>

      <div className="mb-4">
        <label className="block mb-1 text-gray-600">Monto Total Vendido</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Ej: 400000"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-600">Porcentaje de Ganancia (%)</label>
        <input
          type="number"
          value={porcentaje}
          onChange={(e) => setPorcentaje(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Ej: 23"
        />
      </div>

      <button
        onClick={calcularGanancia}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Calcular
      </button>

      {ganancia && (
        <div className="mt-4 text-green-700 font-semibold">
          Ganancia total estimada: ${ganancia}
        </div>
      )}
    </div>
  );
};

export default Ganancia;
