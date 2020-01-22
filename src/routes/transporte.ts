import { Router, Request, Response } from "express";
import TrasnporteControllers from '../controllers/transporteControllers';
import { rutabus } from "../sockets/sockets";
import { Ruta } from "../models/ruta";
import TrasnporteManager from "../manager/transporteManager";

const router = Router();
const transporte = new TrasnporteControllers();
const transporteM = new TrasnporteManager();

// POST - Iniciar la ruta
router.post('/padres', ( req: Request, res: Response  ) => {

    const { codvehiculoruta, flujo, conec } = req.body;

    transporteM.cargaUsuarioPadres( conec, codvehiculoruta, flujo, ( err: string, data: any) => {

        if( err ){
            return res.status(500).json({
                success: false,
                mensaje: 'ERROR: ' + err
            });
        }

        res.json( data );
    });
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