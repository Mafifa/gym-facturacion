import { useState, useCallback } from 'react'
import { Sidebar } from './Sidebar'
import { SearchStudent } from './SearchStudent'
import { BillingHistory } from './BillingHistory'
import { AnalysisSummary } from './AnalisysSummary'
import { Modal } from './Modal'
import { UserPlus, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

export default function Dashboard () {
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('register')
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode)
    document.documentElement.classList.toggle('dark')
  }, [])

  const handleRegisterStudent = useCallback(async (data: any) => {
    const newStudent = {
      nombre_apellido: data.nombre,
      cedula: data.cedula,
      numero_telefono: data.telefono,
      id_usuario_registro: 1,
      id_curso: Number(data.curso)
    }

    try {
      const result = await window.electron.ipcRenderer.invoke('create-estudiante', newStudent)
      if (result.error) {
        throw new Error(result.error)
      }

      const currentIDStudent = result
      if (!currentIDStudent) {
        throw new Error('No se pudo obtener la ID del estudiante')
      }

      const tasaDolar = await window.electron.ipcRenderer.invoke('get-tasa')

      const newPayment = {
        id_estudiante: currentIDStudent,
        id_usuario_facturador: 1,
        tasa_dolar: tasaDolar,
        monto: data.monto,
        fecha_registro: new Date().toISOString()
      }

      const resultMensualidad = await window.electron.ipcRenderer.invoke('create-mensualidad', newPayment)
      if (resultMensualidad.error) {
        throw new Error(resultMensualidad.error)
      }

      toast.success(`${newStudent.nombre_apellido} registrado y primera mensualidad registrada`)
      setShowRegisterModal(false)
    } catch (error) {
      const err = error as Error
      toast.error(`Error: ${err.message}`)
    }
  }, [])

  const handleRegisterPayment = useCallback(async (data: any) => {
    const newPayment = {
      id_estudiante: parseInt(data.estudiante),
      id_usuario_facturador: 1,
      tasa_dolar: parseFloat(data.tasaDolar),
      monto: parseFloat(data.montoMensualidad),
      fecha_registro: new Date().toISOString()
    }

    try {
      const resultMensualidad = await window.electron.ipcRenderer.invoke('create-mensualidad', newPayment)
      if (resultMensualidad.error) {
        throw new Error(resultMensualidad.error)
      }

      toast.success('Mensualidad registrada con éxito')
      setShowPaymentModal(false)
    } catch (error) {
      const err = error as Error
      toast.error(`Error: ${err.message}`)
    }
  }, [])

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">GYM Sistema de Facturación</h1>
        </header>

        {activeTab === 'register' && (
          <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Registro de Estudiantes</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">Registre nuevo cliente en el sistema GYM.</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-6 h-6 text-blue-500" />
                <span className="text-lg font-semibold">Nuevo Cliente</span>
              </div>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Registrar Estudiante
              </button>
            </div>
          </div>
        )}
        {activeTab === 'payment' && (
          <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Registro de Pagos</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">Registre los pagos de mensualidades de los estudiantes.</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-green-500" />
                <span className="text-lg font-semibold">Nueva Mensualidad</span>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition-colors"
              >
                <DollarSign className="mr-2 h-4 w-4" /> Registrar Pago
              </button>
            </div>
          </div>
        )}
        {activeTab === 'search' && <SearchStudent />}
        {activeTab === 'history' && <BillingHistory />}
        {activeTab === 'analysis' && <AnalysisSummary />}

        <Modal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          title="Registrar Estudiante"
          onSubmit={handleRegisterStudent}
          type="student"
        />
        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Registrar Pago"
          onSubmit={handleRegisterPayment}
          type="payment"
        />
      </main>
    </div>
  )
}