import { FaPlusCircle } from "react-icons/fa";
import { FiEdit, FiTrash2, FiUserPlus } from "react-icons/fi";
import { format } from "@formkit/tempo";
import { useState, useEffect } from "react";
import { getMovimiento, descargarReportePDF, newMovimiento, getCajas, delMovimiento } from '../../../api/apiNegocio.js';
import ModalMovimientos from '../../../components/modal/movimientoM.jsx';
import Message from "../../../components/modal/Message.jsx";


export default function Ingreso() {
  const [ingresos, setIngresos] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [typeMessage, setTypeMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  // % de ganancia que se pone al precio de venta
  const [gananciaPorcentaje, setGananciaPorcentaje] = useState(0);
  const [idCaja, setIdCaja] = useState('');
  useEffect(() => {
    const fetchIngresos = async () => {
      try {


        const response = await getMovimiento();
        const ingresosFiltrados = response.filter((ingreso) => ingreso.tipo === 'ingreso');
        if (ingresosFiltrados.length < 0) {
          console.log('No hay ingresos disponibles');

        }
        setIngresos(ingresosFiltrados || []);


        const ultimaCaja = await getCajas()
        console.log(ultimaCaja[ultimaCaja.length - 1].id);
        setIdCaja(ultimaCaja[ultimaCaja.length - 1].id)



      } catch (error) {
        console.error('Error al obtener los ingresos:', error);
        setMessage("Error al obtener los ingresos");
        setTypeMessage("error");
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          window.location.reload();
        }, 3000); // Ocultar el mensaje después de 3 segundos
      }
    };

    fetchIngresos();
  }, []);

  const handleGuardarMovimiento = async (movimiento) => {
    console.log('Movimiento recibido:', movimiento);

    const nuevo = {
      id: ingresos.length + 1,
      fecha: movimiento.fecha,
      descripcion: movimiento.descripcion,
      categoria: movimiento.categoria,
      monto: movimiento.monto,
    };
    const newData = {
      tipo: 'ingreso',
      monto: movimiento.monto,
      descripcion: movimiento.descripcion,
      categoria: movimiento.categoria,
      caja_id: idCaja,
      cliente_id: movimiento.cliente_id,
      kilos_vendidos: movimiento.kilosV
    };

    console.log("newData", movimiento.kilosV);



    try {
      const response = await newMovimiento(newData);
      console.log('Movimiento creado:', response);
      setMessage("Movimiento creado exitosamente");
      setTypeMessage("success");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Ocultar el mensaje después de 3 segundos
    } catch (error) {
      console.error('Error al crear el movimiento:', error);
      setMessage("Error al crear el movimiento");
      setTypeMessage("error");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Ocultar el mensaje después de 3 segundos
    }


    setIngresos([...ingresos, nuevo]);
  };

  const total = ingresos.reduce((acc, ingreso) => acc + Number(ingreso.monto), 0);

  // costo = total / (1 + ganancia%/100)
  const costo = gananciaPorcentaje > 0 ? total / (1 + gananciaPorcentaje / 100) : 0;

  // ganancia absoluta = total - costo
  const gananciaAbsoluta = total - costo;



  const [fechaInicio, setFechaInicio] = useState('');


  const handleDescargar = async () => {
    if (!fechaInicio) {

      alert('Por favor completa la fecha y tipo');
      return;
    }
    const tipo = "ingreso";
    try {
      await descargarReportePDF(fechaInicio, tipo);
      alert('Descarga iniciada');
    } catch (error) {
      alert('Error al descargar el PDF', error);
    }
  };

  // Eliminar movimiento

  const handleEliminar = async (id) => {
    setLoading(true);
    try {
      await delMovimiento(id);
      setIngresos(ingresos.filter((ingreso) => ingreso.id !== id));
      setMessage("Movimiento eliminado exitosamente");
      setTypeMessage("success");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Ocultar el mensaje después de 3 segundos
    } catch (error) {
      console.error('Error al eliminar el movimiento:', error);
      setMessage("Error al eliminar el movimiento");
      setTypeMessage("error");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Ocultar el mensaje después de 3 segundos
    } finally {
      setLoading(false);
    }
  };


  const handleConfirmarEliminar = () => {
    setLoading(true);
    handleEliminar(idToDelete);
    setShowDeleteModal(false);
  };




  return (
    <div className={`min-h-screen bg-gray-100 p-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Ingresos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition"
        >
          <FaPlusCircle className="text-xl" />
          Nuevo ingreso
        </button>
      </div>

      {/* Mensaje arriba del formulario */}
      <Message
        isOpen={showMessage}
        onClose={() => setShowMessage(false)}
        message={message}
        type={typeMessage}
      />

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">¿Estás seguro de eliminar este ingreso?</h2>
            <div className="flex justify-end gap-4">
              <button
                
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarEliminar}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Total de ingresos</h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-4 gap-y-3 mt-2">
          <p className="text-3xl font-bold text-green-600">${total.toFixed(2)}</p>

          <input
            type="number"
            name="ganancia"
            value={gananciaPorcentaje}
            onChange={(e) => setGananciaPorcentaje(Number(e.target.value))}
            className="w-full sm:w-32 border border-gray-300 rounded px-3 py-2"
            placeholder="Ganancia %"
          />

          <h3 className="text-gray-700">
            Costo estimado: ${costo.toFixed(2)}
          </h3>

          <h3 className="text-gray-700 sm:ml-4">
            Ganancia absoluta: ${gananciaAbsoluta.toFixed(2)}
          </h3>
        </div>
      </div>


      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de ingresos</h2>
        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 sticky top-0">
                <th className="border-b border-gray-300 px-4 py-2 text-left text-gray-700">Fecha</th>
                <th className="border-b border-gray-300 px-4 py-2 text-left text-gray-700">Descripción</th>
                <th className="border-b border-gray-300 px-4 py-2 text-left text-gray-700">Categoría</th>
                <th className="border-b border-gray-300 px-4 py-2 text-right text-gray-700">Monto</th>
                <th className="border-b border-gray-300 px-4 py-2 text-center text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.map((ing, index) => (
  <tr key={index} className="hover:bg-gray-50">
    <td className="border-b border-gray-200 px-4 py-2 text-gray-800">{format(ing.fecha) || '-'}</td>
    <td className="border-b border-gray-200 px-4 py-2 text-gray-800">{ing.descripcion}</td>
    <td className="border-b border-gray-200 px-4 py-2 text-gray-800">{ing.categoria || '-'}</td>
    <td className="border-b border-gray-200 px-4 py-2 text-right text-green-600 font-semibold">
      ${Number(ing.monto).toFixed(2)}
    </td>
    <td className="border-b border-gray-200 px-4 py-2 text-center">
      <button
        onClick={() => {
          setIdToDelete(ing.id);
          setShowDeleteModal(true);
        }
        }
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

        {showModal && (
          <ModalMovimientos
            onClose={() => setShowModal(false)}
            onSubmit={handleGuardarMovimiento}
            type={"ingreso"}
          />
        )}
        {total > 0 && (
          <div className="mt-6 flex items-center gap-4">
            <input
              type="date"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
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
