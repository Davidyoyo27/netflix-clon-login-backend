import { Router } from "express";
// llamamos a los metodos a ser usados desde el controlador
import { register, profile } from "../controllers/user.controller.js";
// login del controlador de la BD supabase que es el hosting de la BD
import { login } from "../controllers/user.controller.supabase.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

// usamos el router para poder hacer las peticiones y dejarlos listos para usarlos
router.post('/register', register);
// NOTA: login viene de otro controlador no donde estan el register y profile
router.post('/login', login);
// cada vez que yo haga una peticion GET a profile, va a pasar primero por el "verifyToken"
// recordar que los middlewares se ejecutan antes que las funciones del Controller
router.post('/profile', verifyToken, profile);

export default router;