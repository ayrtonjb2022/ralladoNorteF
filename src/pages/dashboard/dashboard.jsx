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
import { format } from "@formkit/tempo"
//importamos el logo .png
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
    { label: "Caja", icon: <FaCashRegister className="text-3xl text-white" />, color: "bg-blue-600" },
    { label: "Ingresos", icon: <FaMoneyBillWave className="text-3xl text-white" />, color: "bg-green-600" },
    { label: "Gastos", icon: <FaMoneyCheckAlt className="text-3xl text-white" />, color: "bg-red-600" },
    { label: "Análisis", icon: <FaChartBar className="text-3xl text-white" />, color: "bg-purple-600" },
    { label: "Clientes", icon: <FaUser className="text-3xl text-white" />, color: "bg-teal-600" },
    { label: "Perfil", icon: <FaCog className="text-3xl text-white" />, color: "bg-gray-600" },
  ];

  useEffect(() => {
    const cargarCajas = async () => {
      try {
        const cajasData = await getCajas();

        const fechaHoy = format(new Date(), "short");
        console.log(cajasData);

        const existeCajaDelDiaAbierta = cajasData.some((caja) => {
          const fechaCaja = format(caja.fecha, "short");
          console.log("Fecha Caja:", fechaCaja);
          console.log("Fecha Hoy:", fechaHoy);
          return (
            fechaCaja === fechaHoy
          );
        }
        );
        console.log(existeCajaDelDiaAbierta);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-6">
          <FaSpinner className="text-6xl text-blue-600 animate-spin" />
          <img src={logo} alt="Logo" className="w-28 h-28 object-contain" />
          <p className="text-gray-600 text-lg font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="hidden sm:block text-3xl font-bold mb-4 text-gray-800">Dashboard</h1>
        <div className="flex space-x-4 items-center gap">
          {buttons.slice(-2).map((btn) => (
            <button
              key={btn.label}
              onClick={() => setComponenteActivo(btn.label)}
              className={`rounded-full flex items-center justify-center transition-transform hover:scale-105 ${btn.color}`}
              style={{ width: "60px", height: "60px" }}
            >
              <span className="text-4xl">{btn.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Botones principales: solo si la caja está abierta */}
      {stateCajas && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {buttons.slice(0, 4).map((btn) => (
            <button
              key={btn.label}
              onClick={() => setComponenteActivo(btn.label)}
              className={`rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center transition-transform hover:scale-105 ${btn.color}`}
            >
              {btn.icon}
              <span className="text-white mt-2 sm:mt-3 text-base sm:text-xl font-semibold text-center">
                {btn.label}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-300"></div>

        <img
          src={logo}
          alt="Logo"
          className="w-8 h-8 object-contain"
        />

        <div className="flex-1 h-px bg-gray-300"></div>
      </div>


      {/* Componente dinámico */}
      <div className="mt-6">{renderComponenteActivo()}</div>
    </div>
  );
}
