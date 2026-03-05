/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Variáveis de ambiente do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) estão faltando!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const checkSupabaseConnection = async () => {
    try {
        const { error } = await supabase.from('users').select('id').limit(1);
        if (error) throw error;
        return { connected: true };
    } catch (err: any) {
        return {
            connected: false,
            error: err.message || 'Falha ao conectar'
        };
    }
};
