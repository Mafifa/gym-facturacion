// useAnalysisSummary.ts
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Mensualidad, Estudiante, Curso } from '../../../index'

export const useAnalysisSummary = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [mensualidades, setMensualidades] = useState<Mensualidad[]>([])
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [summaryData, setSummaryData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [summaryResult, mensualidadesData, estudiantesData, cursosData] = await Promise.all([
        window.electron.ipcRenderer.invoke('get-summary-data'),
        window.electron.ipcRenderer.invoke('get-mensualidades', startDate, endDate),
        window.electron.ipcRenderer.invoke('get-estudiantes'),
        window.electron.ipcRenderer.invoke('get-cursos')
      ])

      setSummaryData(summaryResult)
      setMensualidades(mensualidadesData)
      setEstudiantes(estudiantesData)
      setCursos(cursosData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const incomeByMonth = useMemo(() => {
    const income: { [key: string]: number } = {}
    mensualidades.forEach((mensualidad) => {
      const date = new Date(mensualidad.fecha_registro)
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
      income[monthYear] = (income[monthYear] || 0) + mensualidad.monto
    })
    return Object.entries(income).map(([monthYear, amount]) => ({ monthYear, amount }))
  }, [mensualidades])

  const studentsByCourse = useMemo(() => {
    const courseCount: { [key: string]: number } = {}
    estudiantes.forEach((estudiante) => {
      const curso = cursos.find((c) => c.id === estudiante.id_curso)
      if (curso) {
        courseCount[curso.nombre] = (courseCount[curso.nombre] || 0) + 1
      }
    })
    return Object.entries(courseCount).map(([name, count]) => ({ name, count }))
  }, [estudiantes, cursos])

  const registrationsByMonth = useMemo(() => {
    const registrations: { [key: string]: number } = {}
    estudiantes.forEach((estudiante) => {
      const date = new Date(estudiante.fecha_registro)
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
      registrations[monthYear] = (registrations[monthYear] || 0) + 1
    })
    return Object.entries(registrations).map(([monthYear, count]) => ({ monthYear, count }))
  }, [estudiantes])

  const mostPopularCourse = useMemo(() => {
    if (studentsByCourse.length === 0) return { nombre: '', count: 0 }
    return studentsByCourse.reduce((max, course) => (course.count > max.count ? course : max), {
      name: '',
      count: 0
    })
  }, [studentsByCourse])

  const averageStudentsPerCourse = useMemo(() => {
    if (summaryData) {
      return summaryData.studentCount / summaryData.courseCount
    }
    return 0
  }, [summaryData])

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    incomeByMonth,
    studentsByCourse,
    registrationsByMonth,
    averageDollarRate: summaryData?.averageDollarRate || 0,
    averageMonthlyPayment: summaryData?.averageMonthlyPayment || 0,
    mostPopularCourse,
    totalIncome: summaryData?.totalIncome || 0,
    averageStudentsPerCourse,
    isLoading
  }
}
