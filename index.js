import express from 'express';
import {sequelize} from './src/models/index.js';
import router from './src/routes/index.js';
import cors from 'cors'
import morgan from 'morgan';
import helmet from 'helmet';
import { errorHandler,notFound } from './src/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

//middleware de seguridad
app.use(helmet())

//configuracion de cors
app.use(cors())
/* app.use(cors({
  origin:process.env.NODE_ENV==='production'?
    ['https://tu-dominio.com'] 
    : 
    ['*'],
    //['http://localhost:5173', 'http://localhost:5174'],  // ['*']. para no filtrar ninguna IP
    credentials: true
})) */

//logging
app.use(morgan(process.env.NODE_ENV==='development'?'dev':'combined'))

//parsing de datos
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({extended:true,limit:'10mb'}))

//ruta de salud de la API
app.get('/healt',(req,res)=>{
  res.json({
    success:true,
    message:'APi funcionando correctamente',
    timestamp:new Date().toISOString(),
  })
})

// Carga de rutas
app.use('/api',router)

//Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Backend funcionando!');
});
//middleware para rutas no encontradas
app.use(notFound)

//middleware de manejo de errores(debe ir al final)
app.use(errorHandler)

// Iniciar servidor y probar conexión DB
async function startServer() {
  try {
    // Intenta autenticar la conexión a la DB
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    // Inicia el servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
}

startServer();