import { Router, Request, Response } from "express";
import Server from '../class/server';
import { usuariosConectados } from '../sockets/sockets';

const router = Router();

router.post('/nuevaubicacion/:latitud/:longitud', (req:Request, res:Response) => {

    // Aqui obtenemos los paramatros enviados en el body
    const codruta = req.body.codruta;
    const descripcion = req.body.descripcion;
    // Parametro enviado por la URL
    const latitud = req.params.latitud;
    const longitud = req.params.longitud;
 
    // Respondemos la peticion
    res.json({
        ok:true,
        mensaje:'Method POST todo bien',
        codruta,
        descripcion,
        latitud,
        longitud
    });

});

router.get('/rutas', (rep:Request, res:Response) => {

    res.json({
        ok:true,
        mensaje:'Todo Bien'
    });

});

router.post('/rutas', (req:Request, res:Response) => {

    const codruta = req.body.codruta;
    const descripcion = req.body.descripcion;

    res.json({
        ok:true,
        mensaje:'Method POST todo bien',
        codruta,
        descripcion
    });

});

router.post('/rutas/:user', (req:Request, res:Response) => {

    // Aqui obtenemos los paramatros enviados en el body
    const codruta = req.body.codruta;
    const descripcion = req.body.descripcion;
    // Parametro enviado por la URL
    const user = req.params.user;

    // Respondemos la peticion
    res.json({
        ok:true,
        mensaje:'Method POST todo bien',
        codruta,
        descripcion,
        user
    });

});

router.post('/mensajeprivado/:id', (req:Request, res:Response) => {

    // Aqui obtenemos los paramatros enviados en el body
    const de = req.body.de;
    const cuerpo = req.body.cuerpo;
    // Parametro ID de la conexion del Usuario enviado por la URL
    const id = req.params.id;
    // Armamos el payload que se enviara a travez de socket
    const payload = { de, cuerpo }
    // Obtenermos la instancia de el servidor con Socket de la clase Server
    const server = Server.instance;
    /* emitimos el evento via Socket
    en este caso usamos 'in' porque lo enviamos a un usuario especifico
    si se quiere enviar a todos los usuario, simplemente omitimos el in */
    server.io.in(id).emit('mensaje-privado', payload);

    res.json({
        ok: true,
        mensaje: 'Method REST-SOCKET todo bien'
    });

});

router.post('/mensajes/:id', (req:Request, res:Response) => {

    // Aqui obtenemos los paramatros enviados en el body
    const de = req.body.de;
    const cuerpo = req.body.cuerpo;
    // Parametro enviado por la URL
    const id = req.params.id;
    // Armamos el payload que se enviara a travez de socket
    const payload = { de, cuerpo }
    // Obtenermos la instancia de el servidor con Socket de la clase Server
    const server = Server.instance;
    /* emitimos el evento via Socket
    en este caso usamos 'in' porque lo enviamos a un usuario especifico
    si se quiere enviar a todos los usuario, simplemente omitimos el in(id) */
    server.io.emit('mensaje-nuevo', payload);

    res.json({
        ok: true,
        mensaje: 'Method REST-SOCKET todo bien'
    });

});

// Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', (rep:Request, res:Response) => {

    // Obtenermos la instancia de el servidor con Socket de la clase Server
    const server = Server.instance;
    // Obtenemos todos los usuarios suscritos a la instancia de socket 
    server.io.clients( (err: any, usuarios: string[] ) => {
        
        // En caso de error, solo retornamos la peticion
        if( err ){
            return res.json({
                ok: false,
                err: ''
            });
        }
        
        // Retornamos los usuario suscritos
        res.json({
            ok: true,
            usuarios
        });

    });
});

// Servicio para obtener todos los IDs y nombres de los usuarios
router.get('/usuarios/detalle', (rep:Request, res:Response) => {

    // Obtenermos la instancia de el servidor con Socket de la clase Server
    const server = Server.instance;
    // Obtenemos todos los usuarios suscritos a la instancia de socket 
    server.io.clients( (err: any, usuarios: string[] ) => {
        
        // En caso de error, solo retornamos la peticion
        if( err ){
            return res.json({
                ok: false,
                err: ''
            });
        }
        
        // Retornamos los usuario suscritos
        res.json({
            ok: true,
            usuarios: usuariosConectados.obtenerListaUsuario()
        });

    });
});

export default router;