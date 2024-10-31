import { UserPlus } from 'lucide-react'

interface RegisterStudentProps {
  setShowRegisterModal: (show: boolean) => void
}

export function RegisterStudent ({ setShowRegisterModal }: RegisterStudentProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Estudiante</h2>
      <p className="mb-4">Ingrese los datos del nuevo estudiante.</p>
      <button
        onClick={() => setShowRegisterModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <UserPlus className="mr-2 h-4 w-4" /> Registrar Estudiante
      </button>
    </div>
  )
}