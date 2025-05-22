import { useEffect, useState } from 'react';
import { getAllVentas } from '../../../api/apiNegocio';
import { FaChartLine, FaRegCalendarCheck } from 'react-icons/fa';
import { MdOutlineSell, MdPersonOutline } from 'react-icons/md';
import Ganancia from '../../../components/ganancia'
const Analisis = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllVentas();
      console.log(data);
      
      setVentas(data);
    };
    fetchData();
  }, []);

  // Procesamiento de datos
  const groupedByDate = ventas.reduce((acc, venta) => {
    const date = venta.fecha.split('T')[0];
    if (!acc[date]) acc[date] = { monto: 0, kilos: 0 };
    acc[date].monto += parseFloat(venta.monto);
    acc[date].kilos += parseFloat(venta.kilos);
    return acc;
  }, {});

  const entries = Object.entries(groupedByDate);


  if (entries.length === 0) {
    return <p className="text-center text-gray-500">No hay datos para analizar.</p>;
  }

  const maxVenta = entries.reduce((max, curr) =>
  parseFloat(curr[1].monto) > parseFloat(max[1].monto) ? curr : max
);

const minVenta = entries.reduce((min, curr) =>
  parseFloat(curr[1].monto) < parseFloat(min[1].monto) ? curr : min
);


  const totalPorCliente = ventas.reduce((acc, venta) => {
    const nombre = venta.Cliente.nombre_cliente;
    if (!acc[nombre]) acc[nombre] = { monto: 0, kilos: 0 };
    acc[nombre].monto += parseFloat(venta.monto);
    acc[nombre].kilos += parseFloat(venta.kilos);
    return acc;
  }, {});

  const mejorCliente = Object.entries(totalPorCliente).reduce((max, curr) => curr[1].monto > max[1].monto ? curr : max);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Análisis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-green-700 font-bold text-lg flex items-center gap-2">
            <FaChartLine /> Día más rentable
          </h2>
          <p>Fecha: <strong>{maxVenta[0]}</strong></p>
          <p>Ganancia: <strong>${maxVenta[1].monto}</strong></p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-red-600 font-bold text-lg flex items-center gap-2">
            <MdOutlineSell /> Día con menor venta
          </h2>
          <p>Fecha: <strong>{minVenta[0]}</strong></p>
          <p>Ingreso: <strong>${minVenta[1].monto}</strong></p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-blue-700 font-bold text-lg flex items-center gap-2">
            <FaRegCalendarCheck /> Mayor monto vendido
          </h2>
          <p>Fecha: <strong>{maxVenta[0]}</strong></p>
          <p>Ingreso: <strong>${maxVenta[1].monto}</strong></p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-purple-700 font-bold text-lg flex items-center gap-2">
            <MdPersonOutline /> Cliente que más compra
          </h2>
          <p>Nombre: <strong>{mejorCliente[0]}</strong></p>
          <p>Total comprado: <strong>${mejorCliente[1].monto}</strong></p>
          <p>Kilos comprados: <strong>{mejorCliente[1].kilos} kg</strong></p>
        </div>
        <Ganancia/>
      </div>
      
    </div>
  );
};

export default Analisis;
