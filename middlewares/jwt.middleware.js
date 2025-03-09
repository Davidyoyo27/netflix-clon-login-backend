import jwt from 'jsonwebtoken';

// NOTA IMPORTANTE: recordar que en este caso el "verifyToken" que es la funcion que verifica 1-. que exista un token y 2-. que el token que 
// se proporciona realmente sea un token valido y no cualquier cosa realmente no se estaria verificando porque para que sea asi, hay que recordar 
// que este verifyToken que pasamos en el "user.route.js" ahi es donde realmente se verifica los puntos señalados al inicio del comentario, y como 
// esto solo es para validar el inicio de sesion de manera simple en el clon del Front de Netflix para que realmente sea valido tendriamos que 
// tambien crear la parte del backend que contiene el perfil y ahi vendria aplicandose en todas las pantallas del FrontEnd (que no sean el Login)
export const verifyToken = (req, res, next) => {

    // va a recibir la cabecera con la autorizacion
    let token = req.headers.authorization;

    // en caso de que no lo encuentre manda la siguiente validacion, esto quiere decir que si no se le manda el token
    // jamas llegara a la parte del profile
    if (!token) {
        return res.status(401).json({ error: "ERROR el token no fue proporcionado" })
    }

    token = token.split(" ")[1];

    try {
        //  .verify() = verifica segun nuestra palabra secreta (process.env.JWT_SECRET) + el token si es correcto
        //      email
        const { payload_email } = jwt.verify(token, process.env.JWT_SECRET);

        // le injectamos al objeto del request la propiedad email
        // puedes inventar la que quieras
        req.injectedEmail = payload_email;

        next();
    } catch (error) {
        return res.status(400).json({ error: "Token invalido" })
    }

}