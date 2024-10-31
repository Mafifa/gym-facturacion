// controllers/MensualidadesController.ts
import { ipcMain } from 'electron'
import MensualidadModel from '../models/Mensualidades'

export default function MensualidadesIPC() {
  ipcMain.handle('get-subscriptions-by-client-id', async (_, cliente_id) => {
    try {
      const result = await MensualidadModel.getByClienteId(cliente_id)
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('create-subscription', async (_, subscription) => {
    const { cliente_id, fecha_inicio, fecha_fin, monto } = subscription
    try {
      const result = await MensualidadModel.create(cliente_id, fecha_inicio, fecha_fin, monto)
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
}
