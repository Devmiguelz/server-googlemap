import { Router, Request, Response } from "express";
import RutaControllers from '../controllers/rutaControllers';
import { rutabus } from "../sockets/sockets";
import { Ruta } from "../models/ruta";

const router = Router();
const rutaControllers = new RutaControllers();

router.get('/rutasxanio/:colegio/:codanio', ( req: Request, res: Response  ) => {

    const colegio = req.params.colegio;
    const codanio = req.params.codanio;

    if( codanio != '' ) {

        rutaControllers.cargarRutasxCodanio( colegio, codanio ).then( ( data: any ) => {

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
                mensaje: 'ERROR: ' + err
            });
        });

    } else {
        return res.status(400).json({
            ok: false,
            mensaje: 'Parametro no recibido'
        });
    }

});

router.get('/vehiculoruta/:colegio/:codanio/:dia/:flujo', ( req: Request, res: Response  ) => {

    // Parametros URL
    const colegio = req.params.colegio;
    const codanio = Number(req.params.codanio);
    const dia = Number(req.params.dia);
    const flujo = req.params.flujo.toString();
    
    if( colegio != null && codanio != null && dia != null && flujo != '') {

        rutaControllers.cargarVehiculoRuta( colegio, codanio, dia, flujo ).then( ( data: any ) => {

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
                mensaje: 'ERROR: ' + err
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

    const { colegio, codanio, mes, codvehiculoruta, fecha, flujo } = req.body;
    
    if( colegio!= '' && codanio != '' && mes != '' && codvehiculoruta != '' && fecha != '' && flujo != '') {

        rutaControllers.cargarEstudianteTransporte( colegio, codanio, mes, codvehiculoruta, fecha, flujo).then( ( data: any ) => {

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
                mensaje: 'ERROR: ' + err
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