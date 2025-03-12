// el dotenv lo usamos porque probamos el archivo manualmente, en este caso 
// seria para ver si se levanto el servidor local
import 'dotenv/config';
import express from 'express';
import userRouter from './routes/user.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// configurar CORS
// app.use(cors());

// Opcional: configurar CORS de forma mas especifica
// IMPORTANTE: Para que el CORS o Configuracion del CORS funcione debe estar si o si antes de las rutas (app.use('/api/v1/users', userRouter);), 
// en este caso la que se usa mas abajo
app.use(
    cors({
        origin: 'https://67d12e65124f52da64cacd1a--netfllix-clon.netlify.app',  // Permitir solo tu fontend
        methods: ['GET', 'POST'],         // Metodos permitidos
        allowedHeaders: ['Content-Type', 'Authorization'], // cabeceras permitidas
        credentials: true,   // Para permitir cookies en solicitudes CORS
    })
);

// con esto se pueden enviar a traves del cuerpo solicitudes json y se podran leer
app.use(express.json());
// 
app.use(cookieParser());
// permitimos que se envien solicitudes a traves de formularios html (Form data)
app.use(express.urlencoded({ extended: true }));

// el use(); es la forma de usar middlewares en express y uno de estos middlewares es el route que usamos (user.route.js)
app.use('/api/v1/users', userRouter);

// le indicamos el puerto en el cual andara el servidor y si no encuentra este, usara el puerto 3000
const PORT = process.env.PORT || 3000;

// mensaje de validacion si esta corriendo correctamente en el puerto indicado
app.listen(PORT, () => console.log('Servidor andando en el puerto: ' + PORT));