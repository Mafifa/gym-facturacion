import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Estudiante, Curso, Mensualidad, Usuario } from '../index'

// Custom APIs for renderer
const api = {
  // Metodos para estudiantes
  getEstudianteByCedula: (cedula: string) => ipcRenderer.invoke('get-estudiante-by-cedula', cedula),
  createEstudiante: (estudiante: Estudiante) => ipcRenderer.invoke('create-estudiante', estudiante),
  deleteEstudiante: (cedula: string) => ipcRenderer.invoke('delete-estudiante', cedula),

  // Métodos para cursos
  getAllCursos: () => ipcRenderer.invoke('get-all-cursos'),
  getCursoById: (id: number) => ipcRenderer.invoke('get-curso-by-id', id),
  createCurso: (curso: Curso) => ipcRenderer.invoke('create-curso', curso),
  deleteCurso: (id: number) => ipcRenderer.invoke('delete-curso', id),

  // Métodos para usuarios
  getAllUsuarios: () => ipcRenderer.invoke('get-all-usuarios'),
  getUsuarioById: (id: number) => ipcRenderer.invoke('get-usuario-by-id', id),
  createUsuario: (usuario: Usuario) => ipcRenderer.invoke('create-usuario', usuario),
  deleteUsuario: (id: number) => ipcRenderer.invoke('delete-usuario', id),

  // Métodos para mensualidades
  getAllMensualidades: () => ipcRenderer.invoke('get-all-mensualidades'),
  getMensualidadById: (id: number) => ipcRenderer.invoke('get-mensualidad-by-id', id),
  getMensualidadByEstudianteCedula: (cedula: string) =>
    ipcRenderer.invoke('get-mensualidad-by-estudiante-cedula', cedula),
  getMensualidadByUsuario: (id: number) => ipcRenderer.invoke('get-mensualidad-by-usuario', id),
  getMensualidadByMonth: (month: string) => ipcRenderer.invoke('get-mensualidad-by-month', month),
  createMensualidad: (mensualidad: Mensualidad) =>
    ipcRenderer.invoke('create-mensualidad', mensualidad),
  deleteMensualidad: (id: number) => ipcRenderer.invoke('delete-mensualidad', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
