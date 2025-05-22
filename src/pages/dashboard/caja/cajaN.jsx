import { FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getCajas, newCaja, upDateCaja } from "../../../api/apiNegocio.js";
import ModalCrearCaja from "../../../components/modal/modalCaja.jsx";

export default function Caja() {
    const [cajas, setCajas] = useState([]);
    const [modalCaja, setModalCaja] = useState(false);
    const [modalCajaUpdate, setModalCajaUpdate] = useState(false);
    const [cajaId, setCajaId] = useState(null);
    const [ingresoInicial, setIngresoInicial] = useState(0);
    const [ingresoFinal, setIngresoFinal] = useState(0);

    useEffect(() => {
        const cargarCajas = async () => {
            const response = await getCajas();
            setCajas(response);

            if (response.length > 0) {
                const fechaFinal = response[response.length - 1].fecha;

                const fechaArgentina = new Date().toLocaleDateString('es-AR', {
                    timeZone: 'America/Argentina/Buenos_Aires',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });

                const [dia, mes, anio] = fechaArgentina.split('/');
                const fechaFormateada = `${anio}-${mes}-${dia}`;

                if (fechaFinal !== fechaFormateada) {
                    setModalCaja(true);
                }
            } else {
                setModalCaja(true); // Si no hay cajas, mostrar modal
            }
        };

        cargarCajas();
    }, []);

    const cajadatos = async (caja) => {
        await newCaja(caja);
        const nuevasCajas = await getCajas();
        setCajas(nuevasCajas);
    };

    const totalCajas = cajas.reduce((acc, c) => acc + Number(c.saldo_final), 0);

   

    const editarCaja = (id) => {
        const cajaSeleccionada = cajas.find((caja) => caja.id === id);
        if (cajaSeleccionada) {
            setCajaId(id);
            setIngresoInicial(cajaSeleccionada.saldo_inicial);
            setIngresoFinal(cajaSeleccionada.saldo_final);
            setModalCajaUpdate(true);
        }
    };

    const upDatateCaja = async () => {
        await upDateCaja(cajaId, {
            saldo_inicial: ingresoInicial,
            saldo_final: ingresoFinal
        });
        const nuevasCajas = await getCajas();
        setCajas(nuevasCajas);
        setModalCajaUpdate(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {modalCaja && (
                <ModalCrearCaja
                    isOpen={modalCaja}
                    onClose={() => setModalCaja(false)}
                    onCreate={cajadatos}
                />
            )}

            {modalCajaUpdate && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h1 className="text-xl font-bold mb-4 text-center">Editar Caja</h1>

                        <label className="block text-gray-700 mb-2">Saldo Inicial:</label>
                        <input
                            type="number"
                            value={ingresoInicial}
                            onChange={(e) => setIngresoInicial(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        />

                        <label className="block text-gray-700 mb-2">Saldo Final:</label>
                        <input
                            type="number"
                            value={ingresoFinal}
                            onChange={(e) => setIngresoFinal(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setModalCajaUpdate(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={upDatateCaja}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold text-gray-800 mb-6">Caja</h1>

            <div className="bg-white p-4 rounded-xl shadow mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Total en caja</h2>
                <p className="text-3xl font-bold text-blue-600 mt-2">${totalCajas}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Historial de cajas</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="p-2 text-left">Fecha</th>
                                <th className="p-2 text-left">Saldo Inicial</th>
                                <th className="p-2 text-left">Saldo Final</th>
                                <th className="p-2 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cajas.map((caja) => (
                                <tr key={caja.id} className="border-b">
                                    <td className="p-2">{caja.fecha}</td>
                                    <td className="p-2 text-green-700 font-semibold">${caja.saldo_inicial}</td>
                                    <td className="p-2 text-blue-700 font-semibold">${caja.saldo_final}</td>
                                    <td className="p-2 flex gap-2">
                                        <button
                                            onClick={() => editarCaja(caja.id)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                        >
                                            <FaEdit /> Editar
                                        </button>
                                        
                                    </td>
                                </tr>
                            ))}
                            {cajas.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-gray-500 p-4">
                                        No hay cajas registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
