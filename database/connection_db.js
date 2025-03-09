// el dotenv lo usamos porque probamos el archivo manualmente, en este caso 
// seria para ver si se establecio la conexion a la BD correctamente
import 'dotenv/config';
import pg from 'pg';

// Pool: es para hacer una agrupacion de conexiones
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

// con esto lo que nosotros haremos sera tratar de hacer una conexion
export const db = new Pool({
    // para que cierre automaticamente las conexiones
    allowExitOnIdle: true,
    connectionString,
});

// probamos la conexion a la BD
try {
    db.query('SELECT NOW()');
    // mostramos un mensaje en la consola para ver si se conecto a la BD
} catch (error) {
    error.message;
}