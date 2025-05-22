import { FaPlusCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getMovimiento, descargarReportePDF, newMovimiento, getCajas } from '../../../api/apiNegocio.js';
import ModalMovimientos from '../../../components/modal/movimientoM.jsx';

export default function Gasto() {
  const [gastos, setGastos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [gananciaPorcentaje, setGananciaPorcentaje] = useState(0); // puedes quitar esto si no se calcula costo/ganancia en gastos
  const [idCaja, setIdCaja] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const response = await getMovimiento();
        const gastosFiltrados = response.filter((gasto) => gasto.tipo === 'gasto');
        setGastos(gastosFiltrados || []);

        const ultimaCaja = await getCajas();
        setIdCaja(ultimaCaja[ultimaCaja.length - 1].id);
      } catch (error) {
        console.error('Error al obtener los gastos:', error);
      }
    };

    fetchGastos();
  }, []);

  const handleGuardarMovimiento = async (movimiento) => {
    console.log('Movimiento recibido:', movimiento);

    const nuevo = {
      id: gastos.length + 1,
      fecha: movimiento.fecha,
      descripcion: movimiento.descripcion,
      categoria: movimiento.categoria,
      monto: movimiento.monto,
    };
    const newData = {
      tipo: 'gasto',
      monto: movimiento.monto,
      descripcion: movimiento.descripcion,
      categoria: movimiento.categoria,
      caja_id: idCaja,
      cliente_id: movimiento.cliente_id,
      kilos_vendidos: movimiento.kilosv
    };

    try {
      const response = await newMovimiento(newData);
      console.log('Gasto creado:', response);
    } catch (error) {
      console.error('Error al crear el gasto:', error);
    }

    setGastos([...gastos, nuevo]);
  };

  const total = gastos.reduce((acc, gasto) => acc + Number(gasto.monto), 0);

  const handleDescargar = async () => {
    if (!fechaInicio) {
      alert('Por favor completa la fecha');
      return;
    }

    const tipo = "gasto";
    try {
      await descargarReportePDF(fechaInicio, tipo);
      alert('Descarga iniciada');
    } catch (error) {
      alert('Error al descargar el PDF', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gastos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:bg-red-700 transition"
        >
          <FaPlusCircle className="text-xl" />
          Nuevo gasto
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Total de gastos</h2>
        <p className="text-3xl font-bold text-red-600 mt-2">${total.toFixed(2)}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de gastos</h2>
        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 sticky top-0">
                <th className="border-b border-gray-300 px-4 py-2 text-left text-gray-700">Fecha</th>
                <th className="border-b border-gray-300 px-4 py-2 text-left text-gray-700">Descripción</th>
                <th className="border-b border-gray-300 px-4 py-2 text-left text-gray-700">Categoría</th>
                <th className="border-b border-gray-300 px-4 py-2 text-right text-gray-700">Monto</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 px-4 py-2 text-gray-800">{g.fecha || '-'}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-gray-800">{g.descripcion}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-gray-800">{g.categoria || '-'}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-right text-red-600 font-semibold">${Number(g.monto).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <ModalMovimientos
            onClose={() => setShowModal(false)}
            onSubmit={handleGuardarMovimiento}
            type={"gasto"}
          />
        )}
        {total > 0 && (
          <div className="mt-6 flex items-center gap-4">
            <input
              type="date"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <button
              className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700 transition"
              onClick={handleDescargar}
            >
              Generar reporte
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
