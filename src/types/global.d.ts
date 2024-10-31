// src/types/global.d.ts

declare global {
  interface Error {
    code?: number // Ejemplo: agregar una propiedad opcional a la interfaz Error global
    message: string
  }
}

// Esto es necesario para que TypeScript trate este archivo como un módulo
export {}
