// models/Pagos.ts
import { supabase } from '../utils/supabase'

class PagoModel {
  static tableName = 'Pagos'

  static async getAll() {
    const { data, error } = await supabase.from(this.tableName).select('*')
    if (error) throw new Error(`Error fetching payments: ${error.message}`)
    return data
  }

  static async getByClienteId(cliente_id: number) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('cliente_id', cliente_id)
    if (error) throw new Error(`Error fetching payments for client ${cliente_id}: ${error.message}`)
    return data
  }

  static async create(cliente_id: number, fecha_pago: Date, monto: number, descripcion: string) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({ cliente_id, fecha_pago, monto, descripcion })
      .select('id, *')
    if (error) throw new Error(`Error creating payment: ${error.message}`)
    return data ? data[0].id : null
  }
}

export default PagoModel
