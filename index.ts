import Server from './class/server';
import router  from './routes/router';
import bodyParser = require('body-parser');
import  cors  from "cors";
const server = Server.instance;

//Configuramos el bodyParser para recibir parametro por body
server.app.use( bodyParser.urlencoded({extended:true}) );
server.app.use( bodyParser.json() );

//Configurar CORS (Cross-origin resource sharing)
server.app.use( cors({origin:true, credentials:true}) );

//Configuramos la rutas
server.app.use('/', router);


server.start(()=>{
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});