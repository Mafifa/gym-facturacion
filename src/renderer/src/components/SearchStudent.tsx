// SearchStudent.tsx
import { useState } from 'react'
import { Search, X, User, Edit2, Loader } from 'lucide-react'
import { useSearchStudent } from '@renderer/hooks/useSearchStudent'
import { toast } from 'sonner'
import RoundedInput from './RoundedInput'

// Utility function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-VE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour12: true
  }).format(date)
}

export function SearchStudent () {
  const {
    setSearchCedula,
    searchName,
    setSearchName,
    selectedStudent,
    filteredStudents,
    editingCourse,
    setEditingCourse,
    newCourseId,
    setNewCourseId,
    cursos,
    handleSearch,
    handleSelectStudent,
    estudianteStatus,
    lastPaymentDate,
    getCursoName,
    handleChangeCourse,
    isLoading
  } = useSearchStudent()

  const [showModal, setShowModal] = useState(false)

  const handleSearchClick = async () => {
    const found = await handleSearch()
    if (found) {
      setShowModal(true)
    } else {
      toast.error('Estudiante no encontrado')
    }
  }

  const handleCedula = (value: string) => {
    setSearchCedula(value)
  }

  const handleStudentSelect = async (student) => {
    await handleSelectStudent(student)
    setShowModal(true)
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Buscar Estudiante</h2>

      {/* Búsqueda por cédula */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Buscar por Cédula</h3>
        <div className="flex space-x-2">
          <RoundedInput onValuesChange={handleCedula} length={8} />
          <button
            onClick={handleSearchClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Buscar
          </button>
        </div>
      </div>

      {/* Búsqueda por nombre */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Buscar por Nombre</h3>
        <input
          type="text"
          placeholder="Nombre del estudiante"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Loader className="animate-spin h-6 w-6 text-blue-500" />
          </div>
        )}
        {!isLoading && filteredStudents.length > 0 && (
          <ul className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            {filteredStudents.map((student) => (
              <li key={student.id} className="border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                <button
                  onClick={() => handleStudentSelect(student)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="font-semibold">{student.nombre_apellido}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cédula: {student.cedula}</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Detalles del Estudiante</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader className="animate-spin h-8 w-8 text-blue-500" />
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>Nombre:</strong> {selectedStudent.nombre_apellido}</p>
                <p><strong>Cédula:</strong> {selectedStudent.cedula}</p>
                <p><strong>Teléfono:</strong> {selectedStudent.numero_telefono}</p>
                <p><strong>Fecha de Registro:</strong> {formatDate(selectedStudent.fecha_registro)}</p>
                <div className="flex items-center">
                  <p><strong>Curso:</strong> {getCursoName(selectedStudent.id_curso)}</p>
                  <button
                    onClick={() => setEditingCourse(!editingCourse)}
                    className="ml-2 text-blue-500 hover:text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                {editingCourse && (
                  <div className="mt-2">
                    <select
                      value={newCourseId || selectedStudent.id_curso}
                      onChange={(e) => setNewCourseId(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {cursos.map((curso) => (
                        <option key={curso.id} value={curso.id}>
                          {curso.nombre}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleChangeCourse}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader className="animate-spin mr-2 h-4 w-4 inline" />
                      ) : null}
                      Guardar Cambios
                    </button>
                  </div>
                )}
                <p><strong>Estado:</strong> {estudianteStatus}</p>
                <p><strong>Última Mensualidad:</strong> {lastPaymentDate ? formatDate(lastPaymentDate) : 'N/A'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}