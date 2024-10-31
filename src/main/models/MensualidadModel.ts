// models/Mensualidades.ts
import { supabase } from '../utils/supabase'

class MensualidadModel {
  static tableName = 'Mensualidades'

  static async getAll() {
    const { data, error } = await supabase.from(this.tableName).select('*')
    if (error) throw new Error(`Error fetching subscriptions: ${error.message}`)
    return data
  }

  static async getByClienteId(cliente_id: number) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('cliente_id', cliente_id)
    if (error)
      throw new Error(`Error fetching subscriptions for client ${cliente_id}: ${error.message}`)
    return data
  }

  static async create(cliente_id: number, fecha_inicio: Date, fecha_fin: Date, monto: number) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({ cliente_id, fecha_inicio, fecha_fin, estado: 'Pendiente', monto })
      .select('id, *')
    if (error) throw new Error(`Error creating subscription: ${error.message}`)
    return data ? data[0].id : null
  }

  static async updateEstado(cliente_id: number, estado: string) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ estado })
      .eq('cliente_id', cliente_id)
    if (error) throw new Error(`Error updating subscription status: ${error.message}`)
    return data
  }
}

export default MensualidadModel
