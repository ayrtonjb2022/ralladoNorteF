import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaKey } from "react-icons/fa"; // NUEVO
import { userUpdate, deleteUser, upDatePassword ,getUsuario} from "../../../api/apiNegocio.js";
import Message from "../../../components/modal/Message.jsx";
import { useNavigate } from "react-router-dom"; // NUEVO

export default function UserProfile() {
  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
  });
  const navigate = useNavigate(); // NUEVO

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false); // NUEVO
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [typeMessage, setTypeMessage] = useState("");

  const [form, setForm] = useState({ ...user });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" }); // NUEVO

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUsuario();
        console.log("userData", userData);
        
        setUser(userData.user);
        setForm(userData.user);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    try {
      await userUpdate(form); console.log(form);

      setUser({ ...form });
      setShowEditModal(false);
      setMessage("Perfil actualizado correctamente");
      setTypeMessage("success");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Ocultar el mensaje después de 3 segundos
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      setMessage("Error al actualizar perfil");
      setTypeMessage("error");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(); // ACTUALIZADO
      setMessage("Usuario eliminado correctamente");
      setTypeMessage("success");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Ocultar el mensaje después de 3 segundos
      setShowDeleteModal(false);
      // Aquí podrías redirigir a otra página
      navigate("/login"); // NUEVO
      sessionStorage.removeItem("token"); // NUEVO
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setMessage("Error al eliminar usuario");
      setTypeMessage("error");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Ocultar el mensaje después de 3 segundos
    }
  };

  const updatePassword = async () => {
    try {
      await upDatePassword(passwordData); 
      alert("Contraseña actualizada correctamente");
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: "", newPassword: "" });
      setMessage("Contraseña actualizada correctamente");
      setTypeMessage("success");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Ocultar el mensaje después de 3 segundos
    } catch (err) {
      console.error("Error al actualizar la contraseña:", err);
      setMessage("Error al actualizar la contraseña");
      setTypeMessage("error");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Ocultar el mensaje después de 3 segundos
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-100 to-indigo-100 flex items-center justify-center px-4">
      
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-sm w-full text-center">
        {/* Mensaje arriba del formulario */}
              <Message
                isOpen={showMessage}
                onClose={() => setShowMessage(false)}
                message={message}
                type={typeMessage}
              />
        <img
          className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-indigo-500 object-cover"
          src={`https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}`}
          alt="Avatar"
        />
        <h2 className="text-2xl font-semibold text-gray-800">
          {user.nombre} {user.apellido}
        </h2>
        <p className="text-gray-500 mt-1">{user.email}</p>

        <div className="mt-6 flex flex-col gap-3 justify-center">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center justify-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition"
          >
            <FaEdit />
            Editar perfil
          </button>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center justify-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition"
          >
            <FaKey />
            Cambiar contraseña
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
          >
            <FaTrash />
            Eliminar cuenta
          </button>
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Editar perfil</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Estás seguro?</h3>
            <p className="text-gray-600 mb-6">Esta acción eliminará tu cuenta permanentemente.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para cambiar contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Cambiar contraseña</h3>
            <div className="space-y-3">
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Contraseña actual"
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Nueva contraseña"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={updatePassword}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
