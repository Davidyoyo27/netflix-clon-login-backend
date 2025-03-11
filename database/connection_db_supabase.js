import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_BASE_URL
const supabaseKey = process.env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)
