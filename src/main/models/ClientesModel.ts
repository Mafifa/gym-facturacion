// models/Clientes.ts
import { supabase } from '../utils/supabase'

class ClienteModel {
  static tableName = 'Clientes'

  static async getAll() {
    const { data, error } = await supabase.from(this.tableName).select('*')
    if (error) throw new Error(`Error fetching clients: ${error.message}`)
    return data
  }

  static async getById(id: number) {
    const { data, error } = await supabase.from(this.tableName).select('*').eq('id', id).single()
    if (error) throw new Error(`Error fetching client with ID ${id}: ${error.message}`)
    return data
  }

  static async create(nombre: string, apellido: string, correo: string, telefono: string) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({ nombre, apellido, correo, telefono, fecha_inscripcion: new Date().toISOString() })
      .select('id, *')
    if (error) throw new Error(`Error creating client: ${error.message}`)
    return data ? data[0].id : null
  }

  static async delete(id: number) {
    const { data, error } = await supabase.from(this.tableName).delete().eq('id', id)
    if (error) throw new Error(`Error deleting client with ID ${id}: ${error.message}`)
    return data
  }
}

export default ClienteModel
