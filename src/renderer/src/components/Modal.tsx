// Modal.tsx
import React, { useState, useEffect } from 'react'
import { X, RefreshCw, Search, Loader } from 'lucide-react'
import RoundedInput from './RoundedInput'
import useRegisterPayment from '../hooks/useRegisterPayment'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  onSubmit: (data: any) => void
  type: 'student' | 'payment'
}

export function Modal ({ isOpen, onClose, title, onSubmit, type }: ModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    curso: 1,
    monto: 20
  })

  const {
    setSearchCedula,
    student,
    isLoading,
    tasaDolar,
    setTasaDolar,
    montoMensualidad,
    setMontoMensualidad,
    handleSearchStudent,
    fetchTasaDolar,
    registerPayment
  } = useRegisterPayment()

  useEffect(() => {
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (type === 'payment') {
      const success = await registerPayment()
      if (success) {
        onClose()
      }
    } else {
      onSubmit(formData)
      onClose()
    }
  }

  const handleCedula = (value: string) => {
    setSearchCedula(value)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {type === 'student' && (
            <>
              <div className="mb-4">
                <label htmlFor="nombre" className="block mb-1">Nombre y Apellido</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cedula" className="block mb-1">Cédula</label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="telefono" className="block mb-1">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="curso" className="block mb-1">Curso</label>
                <select
                  id="curso"
                  name="curso"
                  value={formData.curso}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {/* <!-- Opción para cursos personalizados --> */}
                  <option value="1">Curso personalizado</option>

                  {/* <!-- Jornada de la mañana (7:00 AM - 11:30 AM) --> */}
                  <optgroup label="Jornada de la mañana - Lunes y Miércoles">
                    <option value="2">7:00 AM - 8:30 AM (Lunes y Miércoles)</option>
                    <option value="3">8:30 AM - 10:00 AM (Lunes y Miércoles)</option>
                    <option value="4">10:00 AM - 11:30 AM (Lunes y Miércoles)</option>
                  </optgroup>
                  <optgroup label="Jornada de la mañana - Martes y Jueves">
                    <option value="5">7:00 AM - 8:30 AM (Martes y Jueves)</option>
                    <option value="6">8:30 AM - 10:00 AM (Martes y Jueves)</option>
                    <option value="7">10:00 AM - 11:30 AM (Martes y Jueves)</option>
                  </optgroup>

                  {/* <!-- Jornada de la tarde (2:30 PM - 7:00 PM) --> */}
                  <optgroup label="Jornada de la tarde - Lunes y Miércoles">
                    <option value="8">2:30 PM - 4:00 PM (Lunes y Miércoles)</option>
                    <option value="9">4:00 PM - 5:30 PM (Lunes y Miércoles)</option>
                    <option value="10">5:30 PM - 7:00 PM (Lunes y Miércoles)</option>
                  </optgroup>
                  <optgroup label="Jornada de la tarde - Martes y Jueves">
                    <option value="11">2:30 PM - 4:00 PM (Martes y Jueves)</option>
                    <option value="12">4:00 PM - 5:30 PM (Martes y Jueves)</option>
                    <option value="13">5:30 PM - 7:00 PM (Martes y Jueves)</option>
                  </optgroup>
                </select>
              </div>
            </>
          )}
          {type === 'payment' && (
            <>
              <div className="mb-4">
                <label htmlFor="estudiante" className="block mb-1">Estudiante</label>
                <div className='flex'>
                  <RoundedInput onValuesChange={handleCedula} length={8} />
                  <button
                    type="button"
                    onClick={handleSearchStudent}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors ml-2"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {student && (
                <div className="mb-4">
                  <p><strong>Nombre:</strong> {student.nombre_apellido}</p>
                  <p><strong>Cédula:</strong> {student.cedula}</p>
                </div>
              )}
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex-grow">
                  <label htmlFor="tasaDolar" className="block mb-1">Tasa de Cambio ($)</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="tasaDolar"
                      name="tasaDolar"
                      value={tasaDolar}
                      onChange={(e) => setTasaDolar(e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={fetchTasaDolar}
                      className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader className="animate-spin h-5 w-5" /> : <RefreshCw className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="montoMensualidad" className="block mb-1">Monto de Mensualidad</label>
                <input
                  type="number"
                  id="montoMensualidad"
                  name="montoMensualidad"
                  value={montoMensualidad}
                  onChange={(e) => setMontoMensualidad(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin h-5 w-5 mx-auto" />
            ) : (
              type === 'student' ? 'Registrar Estudiante' : 'Registrar Pago'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}