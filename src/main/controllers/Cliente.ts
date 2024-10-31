// controllers/Cliente.ts
import { ipcMain } from 'electron'
import ClienteModel from '../models/ClientesModel'

export default function ClientesIPC() {
  ipcMain.handle('get-all-clients', async () => {
    try {
      const result = await ClienteModel.getAll()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('create-client', async (_, cliente) => {
    const { nombre, apellido, correo, telefono } = cliente
    try {
      const result = await ClienteModel.create(nombre, apellido, correo, telefono)
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
}
