import axios from "axios";

// este archivo pasaria siendo el "model" que es el que hace directamente las QUERYS a la Base de Datos
// los otros archivos en la carpeta "models" son un ejemplo de ello, pero se hacen de manera diferente
// NOTA IMPORTANTE: Esto practicamente es un servicio, por lo que es un EndPoint, esto lo provee directamente
// el hosting de "supabase" que es el servicio de BD donde se alojo directamente la BD, dentro de supabase 
// se encuentra esta opcion de realizar las interacciones a la BBDD mediante peticiones HTTP
export default {
    // buscar que el email que se le pasa por parametro exista en la BD
    findUserEmail: async (email) => {
        try {
            const axiosConfig = {
                baseURL: process.env.SUPABASE_BASE_URL,
                url: `rest/v1/usuario?select=email_number,password&email_number=eq.${email}`,

                headers: {
                    apikey: process.env.SUPABASE_KEY,
                },

                method: 'get',
            };

            const { data } = await axios.request(axiosConfig);
            return { ok: true, data }
        } catch (error) {
            return { ok: false, error: error.message }
        }
    },
};