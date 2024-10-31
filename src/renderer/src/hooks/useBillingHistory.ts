import { useState, useEffect, useCallback, useMemo } from 'react'
import { Mensualidad, Estudiante } from '../../../index'

export const useBillingHistory = () => {
  const [filteredMensualidades, setFilteredMensualidades] = useState<Mensualidad[]>([])
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [moreMensualidades, setMoreMensualidades] = useState(true)
  const [searchID, setSearchID] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const hasMoreMensualidades = useCallback(async (page: number) => {
    const mensualidades = (await window.electron.ipcRenderer.invoke(
      'get-mensualidad-pagination',
      page + 1
    )) as Mensualidad[]
    return mensualidades.length > 0
  }, [])

  const fetchMensualidades = useCallback(
    async (page: number) => {
      setIsLoading(true)
      try {
        const mensualidades = (await window.electron.ipcRenderer.invoke(
          'get-mensualidad-pagination',
          page,
          searchID
        )) as Mensualidad[]

        const idEstudiantes = mensualidades.map((m) => m.id_estudiante)

        const newEstudiantes = await fetchEstudiantes(idEstudiantes)
        setEstudiantes((prevEstudiantes) => [...prevEstudiantes, ...newEstudiantes])
        setFilteredMensualidades((prevMensualidades) => [...prevMensualidades, ...mensualidades])

        const moreMensualidadesAvailable = await hasMoreMensualidades(page)
        setMoreMensualidades(moreMensualidadesAvailable)
      } finally {
        setIsLoading(false)
      }
    },
    [searchID, hasMoreMensualidades]
  )

  const fetchEstudiantes = useCallback(
    async (idEstudiantes: number[]) => {
      const estudiantes = (await window.electron.ipcRenderer.invoke(
        'get-usuarios-by-id',
        idEstudiantes,
        searchID
      )) as Estudiante[]
      return estudiantes
    },
    [searchID]
  )

  useEffect(() => {
    setFilteredMensualidades([])
    setEstudiantes([])
    setCurrentPage(1)
    fetchMensualidades(1)
  }, [searchID, fetchMensualidades])

  const estudiantesMap = useMemo(() => {
    return estudiantes.reduce(
      (acc, estudiante) => {
        acc[estudiante.id] = estudiante.nombre_apellido
        return acc
      },
      {} as Record<number, string>
    )
  }, [estudiantes])

  return {
    setSearchID,
    searchID,
    filteredMensualidades,
    estudiantesMap,
    currentPage,
    setCurrentPage,
    moreMensualidades,
    fetchMensualidades,
    isLoading
  }
}
