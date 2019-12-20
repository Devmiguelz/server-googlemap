import { Router, Request, Response } from "express";
import Server from '../class/server';
import { usuariosConectados, rutabus } from '../sockets/sockets';
import { Mapa } from '../class/mapa';
import { Ubicacion } from '../class/ubicacion';

const router = Router();
// Mapa
export const mapa = new Mapa();

const ubicaciones: Ubicacion[] = [
    {
        id: '1',
        nombre: 'Mi Casa',
        latitud: 10.969727719654152,
        longitud: -74.8088872968201
    },
    {
        id: '2',
        nombre: 'Iglesia Cristiana',
        latitud: 10.97871995957737,
        longitud: -74.80157136903381
    },
    {
        id: '3',
        nombre: 'Empresa Cloud Technologys Center',
        latitud: 10.982584272007262,
        longitud: -74.7945893126892
    }
  ];

// "..." Permite agregar cada elemento del arreglo de manera independiente
mapa.marcadores.push( ...ubicaciones );

// GET - todos los marcadores
router.get('/marcadores', ( req: Request, res: Response  ) => {
    res.json( mapa.getMarcadores() );
});

// GET - cargamos todos los puntos de las rutas
router.get('/rutas', ( req: Request, res: Response  ) => {
    res.json( rutabus.obtenerRutas() );
});

// GET - Cargamos todos los puntos de un marcador
router.get('/rutas/marcador/:id', ( req: Request, res: Response  ) => {
    // Parametro ID del marcador 
    const id = req.params.id;
    res.json( rutabus.obtenerRutaMarcador( id ) );
});

// POST - todos los puntos de un marcador
router.delete('/eliminar/rutas', ( req: Request, res: Response  ) => {

    rutabus.eliminarRutas();

    res.json({
        ok: true,
        mensaje: 'puntos de ruta eliminados'
    });
});

// POST - todos los puntos de ruta
router.delete('/eliminar/rutamarcador/:id', ( req: Request, res: Response  ) => {

    // Parametro ID del marcador
    const id = req.params.id;
    rutabus.eliminarUbicacionMarcador( id );

    res.json({
        ok: true,
        mensaje: 'puntos de ruta eliminados'
    });
});

















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
            usuarios: usuariosConectados.obtenerListaUsuario()
        });

    });
});

export default router;