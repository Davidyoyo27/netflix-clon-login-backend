// CONTROLADOR es el que recibe las solicitudes desde el Frontend y las procesa donde el quiera, en este caso a nuestro MODELS

// CONEXION a la base de datos de produccion (supabase)
import userModelSupabasePostgREST from "../models/user.model.supabase.postgREST.js";
// importamos la liberia para encriptar la contraseña
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// /api/v1/users/login
export const login = async (req, res) => {
    try {
        // exigimos que el usuario nos mande un email y un password
        const { email, password } = req.body;

        // si no manda cualquiera de los 2 parametros solicitados arriba arrojara un error
        if (!email || !password) {
            // return res.status(400).json({ ok: false, msg: "ERROR se requieren los siguientes campos: email, password" });
            return res.json({ ok: false, msg: "ERROR se requieren los siguientes campos: email, password" });
        }

        // verificamos si el email existe registrado en la BD, si es asi, lo almacena en la variable user
        const { data } = await userModelSupabasePostgREST.findUserEmail(email);

        // si no existe el email ingresado
        if (Array.isArray(data) && data.length === 0) {
            // muestra el siguiente error
            return res.json({ ok: false, msg: "ERROR el email no se encuentra registrado" });
        }

        const emailBD = data[0].email_number;
        // renombramos la variable "password" ya que este campo se llama igual que el parametro arriba en el req.body
        const passwordBD = data[0].password;

        // validamos que la contraseña la cual le proporcionamos en el campo del login, sea la contraseña registrada para el usuario en la BD
        // para realizar esta comparacion usamos el .compare()
        const isMatch = await bcrypt.compare(password, passwordBD);

        // realizamos la validacion si es que la comparacion de las contraseñas no es valida
        if (!isMatch) {
            // retornamos el error
            return res.json({ ok: false, msg: "ERROR credenciales invalidas" });
            // el .status(401) retorna en la consola del navegador un error en rojo, para que esto no pase usa solo el res.json() puesto que
            // de esta forma te manda al Front la respuesta del error del Backend para que puedas manipularla como desees
            // return res.status(401).json({ ok: false, msg: "ERROR credenciales invalidas" });
        }

        // para el token necesitamos 2 cosas
        // 1-. payload (cuerpo del mensaje)
        // 2-. palabrasecreta
        // si todo esta correcto generamos el token
        //                          payload (cuerpo del mensaje)      clave secreta          tiempo de expiracion
        //                                                                                  (puedes usar 1000 o 1000ms haciendo referencia a los segundos)
        const token = jwt.sign({ payload_email: emailBD }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.json({ ok: true, msg: token });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: 'Error server' });
    }
}