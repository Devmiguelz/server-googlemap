import { Router, Request, Response } from "express";
import RutaControllers from '../controllers/rutaControllers';
import { rutabus } from "../sockets/sockets";
import { Ruta } from "../models/ruta";

const router = Router();
const rutaControllers = new RutaControllers();

// GET - cargamos todos los puntos de las rutas desde la BD
router.get('/rutasdb', ( req: Request, res: Response  ) => {

    rutaControllers.cargarRutas().then( ( data: any ) => {

        if( data ) {
            return res.json({
                ok: true,
                resp: data
            });
        }else {
            return res.json({
                ok: false,
                resp: 'No se obtuvo información'
            });
        }

    }).catch((err: any) => {
        return res.status(500).json({
            ok: false,
            mensaje: 'ERROR SERVER'
        });
    });

});

router.get('/rutasxanio/:codanio', ( req: Request, res: Response  ) => {

    const codanio = req.params.codanio;

    if( codanio != '' ) {

        rutaControllers.cargarRutasxCodanio( codanio ).then( ( data: any ) => {

            if( data ) {
                return res.json({
                    ok: true,
                    resp: data
                });
            }else {
                return res.json({
                    ok: false,
                    resp: 'No se obtuvo información'
                });
            }

        }).catch((err: any) => {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR SERVER'
            });
        });

    } else {
        return res.status(400).json({
            ok: false,
            mensaje: 'Parametro no recibido'
        });
    }

});

router.post('/rutasmultiples', ( req: Request, res: Response  ) => {

    const arrayRutas = req.body.body.arrayrutas;
    
    if( arrayRutas != [] ) {

        rutaControllers.cargarMultiplesRutas( arrayRutas ).then( ( data: any ) => {

            if( data ) {
                return res.json({
                    ok: true,
                    resp: data
                });
            }else {
                return res.json({
                    ok: false,
                    resp: 'No se obtuvo información'
                });
            }

        }).catch((err: any) => {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR SERVER: ' + err
            });
        });

    } else {
        return res.status(400).json({
            ok: false,
            mensaje: 'Parametro no recibido'
        });
    }

});

router.get('/vehiculoruta/:codanio/:dia/:flujo', ( req: Request, res: Response  ) => {

    // Parametros URL
    const codanio = Number(req.params.codanio);
    const dia = Number(req.params.dia);
    const flujo = req.params.flujo.toString();
    
    if( codanio != null && dia != null && flujo != '') {

        rutaControllers.cargarVehiculoRuta( codanio, dia, flujo ).then( ( data: any ) => {

            if( data ) {
                return res.json({
                    ok: true,
                    resp: data
                });
            }else {
                return res.json({
                    ok: false,
                    resp: 'No se obtuvo información'
                });
            }

        }).catch((err: any) => {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR SERVER: ' + err
            });
        });

    } else {
        return res.status(400).json({
            ok: false,
            mensaje: 'Parametro no recibido'
        });
    }

});

router.post('/estudiante/transporte', ( req: Request, res: Response  ) => {

    const { codanio, mes, codvehiculoruta, fecha, flujo } = req.body;
    
    if( codanio != '' && mes != '' && codvehiculoruta != '' && fecha != '' && flujo != '') {

        rutaControllers.cargarEstudianteTransporte(codanio, mes, codvehiculoruta, fecha, flujo).then( ( data: any ) => {

            if( data ) {
                return res.json({
                    ok: true,
                    resp: data
                });
            }else {
                return res.json({
                    ok: false,
                    resp: 'No se obtuvo información'
                });
            }

        }).catch((err: any) => {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR SERVER: ' + err
            });
        });

    } else {
        return res.status(400).json({
            ok: false,
            mensaje: 'Parametro no recibido'
        });
    }

});

// GET - cargamos todos los puntos de las rutas
router.get('/cargarpuntos/:codruta/:flujo', ( req: Request, res: Response  ) => {

    const codruta = Number(req.params.codruta);
    const flujo = req.params.flujo;

    const ruta:Ruta[] = rutabus.obtenerRutaxCodruta( codruta, flujo );

    if( ruta.length > 0 ) {
        return res.json({
            ok: true,
            resp: ruta 
        }); 
    }else {
        return res.json({
            ok: false,
            resp: 'No se obtuvo información'
        });
    }

});  

// POST - todos los puntos de un marcador
router.post('/activar', ( req: Request, res: Response  ) => {

    const { codruta, flujo } = req.body;

    if( rutabus.activarRuta( codruta, flujo ) ) {
        res.json({
            ok: true,
            mensaje: `Ruta ${ codruta } Activada`
        });
    }else {
        res.json({
            ok: false,
            mensaje: `La ruta ${ codruta } se encuentra activa`
        });
    }

});

// POST - todos los puntos de un marcador
router.delete('/cerrar', ( req: Request, res: Response  ) => {

    console.log( req.body );
    const { codruta, flujo } = req.body;

    if( rutabus.cerrarRuta( codruta, flujo ) ) {
        res.json({
            ok: true,
            mensaje: 'puntos de ruta eliminados'
        });
    }else {
        res.json({
            ok: false,
            mensaje: 'ruta no encontrada'
        });
    }
});

export default router;