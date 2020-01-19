import { Router, Request, Response } from "express";
import AnioControllers from '../controllers/anioControllers';

const router = Router();
const anioControllers = new AnioControllers();

// GET - cargamos el anio activo
router.get('/anioactivo/:colegio', ( req: Request, res: Response  ) => {

    const colegio = req.params.colegio;

    anioControllers.cargarAnioActivo( colegio ).then( ( data: any ) => {

        return res.json({
            ok: true,
            resp: data
        });

    }).catch((err: any) => {
        return res.status(500).json({
            ok: false,
            mensaje: 'ERROR: ' + err
        });
    });

});

// GET - cargamos los anios
router.get('/cargaranios/:colegio', ( req: Request, res: Response  ) => {

    const colegio = req.params.colegio;

    anioControllers.cargarAnios( colegio ).then( ( data: any ) => {

        return res.json({
            ok: true,
            resp: data
        });

    }).catch((err: any) => {
        return res.status(500).json({
            ok: false,
            mensaje: 'ERROR: ' + err
        });
    });

});

export default router;