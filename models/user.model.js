//el MODELS es el encargado de enviar todas las sentencias SQL a Postgres

// llamamos a db puesto que es el nombre de lo que exportamos al crear la conexion a la base de datos
import { db } from '../database/connection_db.js';

// creamos el usuario que usaremos para realizar el login
export const createUser = async (email_number, password) => {
    const query = {
        text: `
        INSERT INTO usuario (email_number, password) 
          VALUES ($1, $2)
        `,
        values: [email_number, password]
    }

    const { rows } = await db.query(query);
    return rows[0];
};

// async/await porque necesitamos hacer una solicitud al servidor
// esa solicitud es una promesa porque no sabemos cuanto tiempo se va a demorar
// como en la base de datos, la tabla "usuario" el campo email es unico, se entiende que solo existira un usuario asociado a ese email
export const findUserEmail = async (email_number) => {
    // PARAMETRIZAREMOS TODAS LAS CONSULTAS SQL, ESTO QUIERE DECIR QUE CADA DATO DINAMICO QUE NOS ENVIE EL CLIENTE
    // PASARA POR UN FILTRO, ESTO PARA QUE NO NOS HAGAN SQL INJECTION
    const query = {
        // IMPORTANTE: recordar no usar la interpolacion de variables ${} dentro de los backslash
        // ya que esa es una forma en la cual nos podrian hacer SQL Injection
        text: `
        SELECT id, email_number, password
          FROM usuario 
          WHERE email_number = $1
        `,
        // el "email_number" representa lo que se ingresa como parametro de entrada en al funcion
        // tambien en la consulta el $1 es el "email_number" del values
        values: [email_number]
    }

    const { rows } = await db.query(query);
    return rows[0];
};