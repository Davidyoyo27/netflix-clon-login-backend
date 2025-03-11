import { supabase } from '../database/connection_db_supabase.js';

export const createUser = async (email_number, password) => {
    const { data, error } = await supabase
        .from('usuario')
        .insert([{ email_number, password }])
        .select();

    if (error) throw error;
    return data[0];
};

export const findUserEmail = async (email_number) => {
    const { data, error } = await supabase
        .from('usuario')
        .select('id, email_number, password')
        .eq('email_number', email_number)
        .single();

    if (error) throw error;
    return data;
};
