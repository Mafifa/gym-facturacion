import { useCallback } from 'react'
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import { useBillingHistory } from '../hooks/useBillingHistory'

export function BillingHistory () {
  const {
    filteredMensualidades,
    estudiantesMap,
    currentPage,
    setCurrentPage,
    moreMensualidades,
    fetchMensualidades,
    searchID,
    setSearchID,
    isLoading
  } = useBillingHistory()

  const handleNextPage = useCallback(() => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchMensualidades(nextPage)
  }, [currentPage, setCurrentPage, fetchMensualidades])

  const handlePreviousPage = useCallback(() => {
    const prevPage = currentPage - 1
    if (prevPage >= 1) {
      setCurrentPage(prevPage)
      fetchMensualidades(prevPage)
    }
  }, [currentPage, setCurrentPage, fetchMensualidades])

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Historial de Facturación</h2>
      <div className="mb-4 flex space-x-4">
        <div>
          <label htmlFor="search-id" className="block mb-1">Buscar por Numero de Factura</label>
          <input
            id="search-id"
            type="text"
            value={searchID}
            onChange={(e) => setSearchID(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese numero de Factura"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Fecha</th>
              <th className="py-3 px-6 text-left">Estudiante</th>
              <th className="py-3 px-6 text-left">Monto</th>
              <th className="py-3 px-6 text-left">Tasa Dólar</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
            {isLoading && (
              <tr>
                <td colSpan={4} className="py-4 text-center">
                  <Loader className="animate-spin inline-block mr-2" />
                  Cargando...
                </td>
              </tr>
            )}
            {!isLoading && filteredMensualidades.map((mensualidad) => {
              // Convertir la fecha al formato venezolano
              const fechaRegistro = new Date(mensualidad.fecha_registro).toLocaleDateString('es-VE', {
                timeZone: 'America/Caracas',
                hour12: true, // Formato de 24 horas
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <tr key={mensualidad.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{fechaRegistro}</td>
                  <td className="py-3 px-6 text-left">{estudiantesMap[mensualidad.id_estudiante] || 'Desconocido'}</td>
                  <td className="py-3 px-6 text-left">${mensualidad.monto.toFixed(2)}</td>
                  <td className="py-3 px-6 text-left">${mensualidad.tasa_dolar.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextPage}
            disabled={!moreMensualidades || isLoading}
            className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}