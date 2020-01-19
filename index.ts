import Server from './src/server/server';
import bodyParser = require('body-parser');
import  cors  from "cors";
const server = Server.instance;

//Configuramos el bodyParser para recibir parametro por body
server.app.use( bodyParser.urlencoded({extended:true}) );
server.app.use( bodyParser.json() );

//Configurar CORS (Cross-origin resource sharing)
server.app.use( cors({origin:true, credentials:true}) );
// Configurar cabeceras y cors
server.app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Configuracion de Entorno - production=1, development=0
process.env.NODE_ENV = "development";

//Configuramos la rutas independientes
import transporteRoutes from './src/routes/transporte';
import anioRoutes from './src/routes/anio';


server.app.use('/transporte', transporteRoutes);
server.app.use('/anio', anioRoutes);


server.start(()=>{
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});