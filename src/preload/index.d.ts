import { ElectronAPI } from '@electron-toolkit/preload'
import { Estudiante, Curso, Mensualidad, Usuario } from '../index'
interface API {
  // Metodos para estudiantes
  getEstudianteByCedula(cedula: string): Promise<Estudiante | undefined>
  createEstudiante(estudiante: Estudiante): Promise<void>
  deleteEstudiante(cedula: string): Promise<void>

  // Métodos para cursos
  getAllCursos(): Promise<Curso[]>
  getCursoById(id: number): Promise<Curso | undefined>
  createCurso(curso: Curso): Promise<void>
  deleteCurso(id: number): Promise<void>

  // Métodos para usuarios
  getAllUsuarios(): Promise<Usuario[]>
  getUsuarioById(id: number): Promise<Usuario | undefined>
  createUsuario(usuario: Usuario): Promise<void>
  deleteUsuario(id: number): Promise<void>

  // Métodos para mensualidades
  getAllMensualidades(): Promise<Mensualidad[]>
  getMensualidadById(id: number): Promise<Mensualidad | undefined>
  getMensualidadByEstudianteCedula(cedula: string): Promise<Mensualidad[]>
  getMensualidadByUsuario(id: number): Promise<Mensualidad[]>
  getMensualidadByMonth(month: string): Promise<Mensualidad[]>
  createMensualidad(mensualidad: Mensualidad): Promise<void>
  deleteMensualidad(id: number): Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
