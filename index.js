
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');
// Crear el servidor express
const app = express();

// Base de datos
dbConnection();

// Cors
app.use(cors());

// Directorio publico
app.use( express.static('public') );

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/items', require('./routes/item'));

app.use('/api/listProducts', require('./routes/listProducts')); 

//TODO: CRUD de categorias
//TODO: CRUD de Listas





app.listen(process.env.PORT, () => {
  console.log(`Servidor iniciado en el puerto ${process.env.PORT}`);
});