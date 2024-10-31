// useSearchStudent.ts
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { Estudiante, Curso, Mensualidad } from '../../../index'
import Cursos from '../utils/cursos'

export const useSearchStudent = () => {
  const [searchCedula, setSearchCedula] = useState('')
  const [searchName, setSearchName] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(null)
  const [filteredStudents, setFilteredStudents] = useState<Estudiante[]>([])
  const [editingCourse, setEditingCourse] = useState(false)
  const [newCourseId, setNewCourseId] = useState<number | null>(null)
  const [cursos, setCursos] = useState<Curso[]>([])
  const [estudianteStatus, setEstudianteStatus] = useState<string>('')
  const [lastPaymentDate, setLastPaymentDate] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchEstudiantes = useCallback(async (searchName: string) => {
    setIsLoading(true)
    try {
      return (await window.electron.ipcRenderer.invoke(
        'get-estudiantes-by-name',
        searchName
      )) as Estudiante[]
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchEstudianteByCedula = useCallback(async (cedula: string) => {
    setIsLoading(true)
    try {
      return (await window.electron.ipcRenderer.invoke(
        'get-estudiante-by-cedula',
        cedula
      )) as Estudiante[]
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchCursos = useCallback(async () => {
    setIsLoading(true)
    try {
      setCursos(Cursos)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getLastPaymentByIPC = useCallback(async (estudianteID: number) => {
    setIsLoading(true)
    try {
      return (await window.electron.ipcRenderer.invoke(
        'get-last-mensualidad-by-estudiante-id',
        estudianteID
      )) as Mensualidad | null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCursos()
  }, [fetchCursos])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchName.length > 2) {
        const students = await fetchEstudiantes(searchName)
        setFilteredStudents(students)
      } else {
        setFilteredStudents([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchName, fetchEstudiantes])

  const handleSearch = useCallback(async () => {
    const students = await fetchEstudianteByCedula(searchCedula)
    if (students.length > 0) {
      const student = students[0]
      setSelectedStudent(student)
      await updateEstudianteStatus(student.id)
      return true
    } else {
      return false
    }
  }, [searchCedula, fetchEstudianteByCedula])

  const handleSelectStudent = useCallback(async (student: Estudiante) => {
    setSelectedStudent(student)
    await updateEstudianteStatus(student.id)
  }, [])

  const updateEstudianteStatus = useCallback(
    async (estudianteId: number) => {
      const lastPayment = await getLastPaymentByIPC(estudianteId)
      if (!lastPayment) {
        setEstudianteStatus('Sin pagos registrados')
        setLastPaymentDate('Sin pagos registrados')
        return
      }

      const currentDate = new Date()
      const lastPaymentDate = new Date(lastPayment.fecha_registro)
      setLastPaymentDate(lastPayment.fecha_registro)

      if (
        lastPaymentDate.getFullYear() === currentDate.getFullYear() &&
        lastPaymentDate.getMonth() === currentDate.getMonth()
      ) {
        setEstudianteStatus('Solvente')
      } else {
        setEstudianteStatus('Moroso')
      }
    },
    [getLastPaymentByIPC]
  )

  const getCursoName = useCallback(
    (id: number) => {
      const curso = cursos.find((c) => c.id === id)
      return curso ? curso.nombre : 'Desconocido'
    },
    [cursos]
  )

  const handleChangeCourse = useCallback(async () => {
    if (selectedStudent && newCourseId) {
      setIsLoading(true)
      try {
        const result = await window.electron.ipcRenderer.invoke(
          'update-student-course',
          selectedStudent.id,
          newCourseId
        )
        if (result.success) {
          setSelectedStudent({ ...selectedStudent, id_curso: newCourseId })
          setEditingCourse(false)
          toast.success('Curso actualizado')
        } else {
          throw new Error('Error al actualizar curso')
        }
      } catch (error) {
        toast.error('Error al actualizar curso')
      } finally {
        setIsLoading(false)
      }
    }
  }, [selectedStudent, newCourseId])

  return {
    searchCedula,
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
  }
}
