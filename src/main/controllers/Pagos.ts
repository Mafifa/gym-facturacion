// controllers/PagosController.ts
import { ipcMain } from 'electron'
import PagoModel from '../models/PagosModel'

export default function PagosIPC() {
  ipcMain.handle('get-payments-by-client-id', async (_, cliente_id) => {
    try {
      const result = await PagoModel.getByClienteId(cliente_id)
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('create-payment', async (_, payment) => {
    const { cliente_id, fecha_pago, monto, descripcion } = payment
    try {
      const result = await PagoModel.create(cliente_id, fecha_pago, monto, descripcion)
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
}
