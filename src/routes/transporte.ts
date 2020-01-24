import { Router, Request, Response } from "express";
import TrasnporteControllers from '../controllers/transporteControllers';
import TrasnporteManager from "../manager/transporteManager";
import Server from '../server/server';

const router = Router();
const transporte = new TrasnporteControllers();
const transporteM = new TrasnporteManager();

// POST - Iniciar la ruta
router.post('/socket', ( req: Request, res: Response  ) => {

    const server = Server.instance;
    const payload = { lat: 14252, lng: -74145 };   
    server.io.emit('listen-ubicacion-online-ruta', payload);

    server.io.clients( (err: any, client: any) => {
        res.json({ ok:true, mensaje: client }); 
    });

    // res.json({ok:true,mensaje:'emitido'});

});

// POST - Iniciar la ruta
router.post('/iniciarRuta', ( req: Request, res: Response  ) => {

    const { codvehiculoruta, codusuario, tipoapp, conec } = req.body;

    transporte.iniciarRuta( conec, codvehiculoruta, codusuario, tipoapp, ( err: string, data: any) => {

        if( err ){
            return res.status(500).json({
                success: false,
                mensaje: 'ERROR: ' + err
            });
        }

        res.json( data );
    });
});

// POST - Detener ruta
router.post('/detenerRuta', ( req: Request, res: Response  ) => {

    const { codvehiculoruta, fecha, conec } = req.body;

    transporte.detenerRuta( conec, codvehiculoruta, fecha, ( err: string, data: any) => {

        if( err ){
            return res.status(500).json({
                success: false,
                mensaje: 'ERROR: ' + err
            });
        }

        res.json( data );
    });
});

// POST - Guardar los puntos Offonline
router.post('/guardarRutaOffline', ( req: Request, res: Response  ) => {

    const { listaSeguimiento, codvehiculoruta, fechasubir, conec } = req.body;

    transporte.guardarRutaOffline( listaSeguimiento, codvehiculoruta, fechasubir, conec, ( err: string, data: any) => {

        if( err ){
            return res.status(500).json({
                success: false,
                mensaje: 'ERROR: ' + err
            });
        }

        res.json( data );
    });
});

// POST - Guardar los puntos online
router.post('/guardarRutaOnline', ( req: Request, res: Response  ) => {

    const { flujo, ruta, latitud, longitud, conec, token } = req.body;
    // ruta == codvehiculoruta
    transporte.guardarRutaOnline( conec, ruta, flujo, latitud, longitud, token, ( err: string, data: any) => {

        if( err ){
            return res.status(500).json({
                success: false,
                mensaje: 'ERROR: ' + err
            });
        }

        res.json( data );
    });
});

export default router;