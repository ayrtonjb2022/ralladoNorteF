import { useState, useEffect } from "react";
import {
  FaCashRegister,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaChartBar,
  FaUser,
  FaCog,
  FaBars,
  FaTimes,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        return <Caja/>;
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-white">
      {/* Botón hamburguesa solo en móvil */}
      <button
        className="fixed top-4 left-4 z-50 text-3xl text-gray-700 sm:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg flex flex-col items-center py-6
          w-64 sm:w-24
          transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full sm:translate-x-0"
          }
          z-40
        `}
      >
        <img src={logo} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 mb-8" />
        <nav className="flex flex-col gap-6 flex-1">
          {buttons.map((btn) => {
            const activo = componenteActivo === btn.label;
            return (
              <button
                key={btn.label}
                onClick={() => {
                  setComponenteActivo(btn.label);
                  setSidebarOpen(false); // cierra sidebar en móvil cuando clickeas
                }}
                className={`
                  flex flex-col items-center justify-center
                  w-12 h-12 sm:w-14 sm:h-14 rounded-lg
                  text-white text-2xl
                  transition-all duration-200
                  ${activo ? btn.color : "bg-gray-300 hover:bg-gray-400"}
                  ${activo ? "scale-110 shadow-lg" : "shadow-sm"}
                `}
                title={btn.label}
              >
                {btn.icon}
                <span className="sr-only">{btn.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="text-gray-400 text-xs mt-auto px-1 select-none hidden sm:block">
          © 2025 Massibo
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 sm:ml-24 p-6 overflow-auto">
        {renderComponenteActivo()}
      </main>

      

    </div>
  );
}
