export interface Usuario {
  id: number
  nombre: string
  contrasena: string
  admin: boolean
}

export interface Curso {
  id: number
  nombre: string
}

export interface Estudiante {
  id: number
  nombre_apellido: string
  cedula: string
  numero_telefono: string
  id_usuario_registro: number
  fecha_registro: string
  id_curso: number
}

export interface Mensualidad {
  id: number
  id_estudiante: number
  id_usuario_facturador: number
  tasa_dolar: number
  monto: number
  fecha_registro: string
}
