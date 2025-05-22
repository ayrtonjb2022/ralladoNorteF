// Mismo import que tú usaste
import { useState, useEffect } from "react";
import {
  FaCashRegister,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaChartBar,
  FaUser,
  FaCog,
  FaSpinner,
} from "react-icons/fa";
import { format } from "@formkit/tempo";
import logo from "../../assets/logo.png";
import Ingreso from "./ingreso/ingresoN.jsx";
import Caja from "./caja/cajaN.jsx";
import Gastos from "./gastos/gastosN.jsx";
import Analisis from "./analisis/analisisN.jsx";
import Clientes from "./clientes/clientesN.jsx";
import UserProfile from "./Profile/UserProfile.jsx";
import { getCajas } from "../../api/apiNegocio.js";

export default function Dashboard() {
  const [componenteActivo, setComponenteActivo] = useState("Caja");
  const [loading, setLoading] = useState(true);
  const [stateCajas, setStateCajas] = useState(true);

  const buttons = [
    { label: "Caja", icon: <FaCashRegister />, color: "bg-blue-500" },
    { label: "Ingresos", icon: <FaMoneyBillWave />, color: "bg-emerald-500" },
    { label: "Gastos", icon: <FaMoneyCheckAlt />, color: "bg-rose-500" },
    { label: "Análisis", icon: <FaChartBar />, color: "bg-indigo-500" },
    { label: "Clientes", icon: <FaUser />, color: "bg-teal-500" },
    { label: "Perfil", icon: <FaCog />, color: "bg-gray-500" },
  ];

  useEffect(() => {
    const cargarCajas = async () => {
      try {
        const cajasData = await getCajas();
        const fechaHoy = format(new Date(), "short");
        const existeCajaDelDiaAbierta = cajasData.some((caja) =>
          format(caja.fecha, "short") === fechaHoy
        );
        setStateCajas(existeCajaDelDiaAbierta);
        setComponenteActivo(existeCajaDelDiaAbierta ? null : "Caja");
      } catch (error) {
        console.error("Error al cargar cajas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCajas();
  }, []);

  const renderComponenteActivo = () => {
    switch (componenteActivo) {
      case "Caja":
        return <Caja />;
      case "Ingresos":
        return <Ingreso />;
      case "Gastos":
        return <Gastos />;
      case "Análisis":
        return <Analisis />;
      case "Clientes":
        return <Clientes />;
      case "Perfil":
        return <UserProfile />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <FaSpinner className="text-6xl text-blue-500 animate-spin mb-4" />
        <img src={logo} alt="Logo" className="w-28 h-28 object-contain mb-2" />
        <p className="text-gray-700 text-lg font-medium">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white px-6 py-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="hidden sm:block text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        <div className="flex gap-4">
          {buttons.slice(-2).map((btn) => (
            <button
              key={btn.label}
              onClick={() => setComponenteActivo(btn.label)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-md hover:scale-110 transition-transform duration-200 ${btn.color}`}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Botones principales */}
      {stateCajas && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {buttons.slice(0, 4).map((btn) => (
            <button
              key={btn.label}
              onClick={() => setComponenteActivo(btn.label)}
              className={`p-5 rounded-2xl shadow-md backdrop-blur-sm bg-opacity-80 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center ${btn.color}`}
            >
              <span className="text-3xl mb-2">{btn.icon}</span>
              <span className="text-lg font-semibold">{btn.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Separador con logo */}
      <div className="flex items-center justify-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-300" />
        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Contenido dinámico */}
      <div className="mt-6">{renderComponenteActivo()}</div>
    </div>
  );
}
