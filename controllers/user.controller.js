// CONTROLADOR es el que recibe las solicitudes desde el Frontend y las procesa donde el quiera, en este caso a nuestro MODELS

// CONEXION a la base de datos local
// import { findUserEmail, createUser } from "../models/user.model.js";
// CONEXION a la base de datos de produccion (supabase)
import { createUser, findUserEmail } from "../models/user.models.supabaseDB.js";
// importamos la liberia para encriptar la contraseña
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// /api/v1/users/register
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // si no existe un email o una contraseña arrojara una validacion
        if (!req.body.email || !password) {
            return res.status(400).json({ ok: false, msg: "ERROR se requieren los siguientes campos: email, password" });
        }

        // verificamos que el email ingresado no este en la BD
        const user = await findUserEmail(email);
        // si llega a existir el usuario, no podemos crearlo
        if (user) {
            return res.status(409).json({ ok: false, msg: "ERROR el email ya existe" });
        }

        // los saltos son palabras aleatorias que se le estaran colocando al hash de la contraseña
        // EJ: si se registraran dos usuarios con la misma contraseña su hasheo de la password no seria el mismo
        const salt = await bcrypt.genSalt(10);
        // hasheamos la contraseña antes de ser guardada en la BD
        const hashedPassword = await bcrypt.hash(password, salt);

        // si no existe ningun problema y pasa las validaciones de arriba, crearemos un nuevo usuario y lo registraremos en la BD
        const newUser = await createUser(email, hashedPassword);

        return res.status(201).json({ ok: true, msg: newUser });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: 'Error server' });
    }
}

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
        const user = await findUserEmail(email);

        // si no existe el email ingresado
        if (!user) {
            // muestra el siguiente error
            return res.json({ ok: false, msg: "ERROR el email no se encuentra registrado" });
        }

        // validamos que la contraseña la cual le proporcionamos en el campo del login, sea la contraseña registrada para el usuario en la BD
        // para realizar esta comparacion usamos el .compare()
        const isMatch = await bcrypt.compare(password, user.password);

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
        const token = jwt.sign({ payload_email: user.email_number }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // bloque de codigo que guarda el token en HTTPOnly Cookies
        // Guardar refresh token en una cookie segura
        // res.cookie('Token-cookie-be', token, {
        //     httpOnly: true,
        //     secure: true, 
        //     sameSite: "Strict",
        //     // los 1000 representan el tiempo en milisegundos, asi que 1000ms = 1seg
        //     // maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 dias
        //     maxAge: 60 * 1000,   // 7 dias
        // });

        return res.json({ ok: true, msg: token });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: 'Error server' });
    }
}

// ruta protegida
export const profile = async (req, res) => {
    try {
        const { injectedEmail } = req;
        const user = await findUserEmail(injectedEmail);

        // retorno toda la informacion del usuario, en este caso en el "user" que es lo que paso del usuario solo es el email
        return res.json({ ok: true, msg: user });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: 'Error server' });
    }
}