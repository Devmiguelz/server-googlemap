import { Router, Request, Response } from "express";
import TrasnporteControllers from '../controllers/transporteControllers';
import { rutabus } from "../sockets/sockets";
import { Ruta } from "../models/ruta";

const router = Router();
const transporte = new TrasnporteControllers();


// POST - Iniciar la ruta
router.post('/iniciarRuta', ( req: Request, res: Response  ) => {

    const { codvehiculoruta, codusuario, tipoapp, conec } = req.body;

    transporte.iniciarRuta( codvehiculoruta, codusuario, tipoapp, conec ).then((data: any) => {
        res.json({
            success: true,
            mensaje: data
        });
    }).catch((err: any) => {
        return res.status(500).json({
            ok: false,
            mensaje: 'ERROR: ' + err
        });
    });

});

// POST - Guardar los puntos Offonline
router.post('/guardarRutaOffline', ( req: Request, res: Response  ) => {

    const { listaSeguimiento, codvehiculoruta, fechasubir, conec } = req.body;

    transporte.guardarRutaOffline( listaSeguimiento, codvehiculoruta, fechasubir, conec ).then((data: any) => {
        res.json( data );
    }).catch((err: any) => {
        return res.status(500).json({
            success: false,
            mensaje: 'ERROR: ' + err
        });
    });
    
});

router.get('/rutasxanio/:colegio/:codanio', ( req: Request, res: Response  ) => {

    const colegio = req.params.colegio;
    const codanio = req.params.codanio;

    if( codanio != '' ) {

        transporte.cargarRutasxCodanio( colegio, codanio ).then( ( data: any ) => {

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

        transporte.cargarVehiculoRuta( colegio, codanio, dia, flujo ).then( ( data: any ) => {

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

        transporte.cargarEstudianteTransporte( colegio, codanio, mes, codvehiculoruta, fecha, flujo).then( ( data: any ) => {

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