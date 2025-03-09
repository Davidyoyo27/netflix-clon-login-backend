import { Router } from "express";
// llamamos a los metodos a ser usados desde el controlador
import { login, register, profile } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

// usamos el router para poder hacer las peticiones y dejarlos listos para usarlos
router.post('/register', register);
router.post('/login', login);
// cada vez que yo haga una peticion GET a profile, va a pasar primero por el "verifyToken"
// recordar que los middlewares se ejecutan antes que las funciones del Controller
router.post('/profile', verifyToken, profile);

export default router;