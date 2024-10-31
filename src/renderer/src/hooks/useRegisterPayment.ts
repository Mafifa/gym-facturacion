// useRegisterPayment.ts
import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface Student {
  id: number
  nombre_apellido: string
  cedula: string
}

export default function useRegisterPayment() {
  const [searchCedula, setSearchCedula] = useState('')
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tasaDolar, setTasaDolar] = useState('')
  const [montoMensualidad, setMontoMensualidad] = useState('20')

  const handleSearchStudent = useCallback(async () => {
    if (!searchCedula) {
      toast.error('Por favor, ingrese una cédula')
      return
    }

    setIsLoading(true)
    try {
      const result = await window.electron.ipcRenderer.invoke(
        'get-estudiante-by-cedula',
        searchCedula
      )
      if (result && result.length > 0) {
        setStudent(result[0])
      } else {
        toast.error('Estudiante no encontrado')
        setStudent(null)
      }
    } catch (error) {
      toast.error('Error al buscar estudiante')
      setStudent(null)
    } finally {
      setIsLoading(false)
    }
  }, [searchCedula])

  const fetchTasaDolar = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await window.electron.ipcRenderer.invoke('get-tasa')
      setTasaDolar(data.promedio)
    } catch (error) {
      toast.error('Error al obtener la tasa de cambio')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const registerPayment = useCallback(async () => {
    if (!student || !tasaDolar || !montoMensualidad) {
      toast.error('Por favor, complete todos los campos')
      return
    }

    setIsLoading(true)
    try {
      const result = await window.electron.ipcRenderer.invoke('create-mensualidad', {
        id_estudiante: student.id,
        id_usuario_facturador: 1,
        tasa_dolar: parseFloat(tasaDolar),
        monto: parseFloat(montoMensualidad)
      })
      if (result.success) {
        toast.success('Pago registrado exitosamente')
        return true
      } else {
        throw new Error('Error al registrar el pago')
      }
    } catch (error) {
      toast.error('Error al registrar el pago')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [student, tasaDolar, montoMensualidad])

  return {
    searchCedula,
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
  }
}
