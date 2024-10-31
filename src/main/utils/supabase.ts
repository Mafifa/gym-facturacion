import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = 'https://omgqiqspfjhzlzbdcyti.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tZ3FpcXNwZmpoemx6YmRjeXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMzgyMzIsImV4cCI6MjA0NTkxNDIzMn0.n5NkqH_9XOYxnNuIaq43EsVdY9sS2G94rvBiX2h5K-g'

export const supabase = createClient(supabaseUrl, supabaseKey)
