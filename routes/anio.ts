import { Router, Request, Response } from "express";
import AnioControllers from '../controllers/anioControllers';

const router = Router();
const anioControllers = new AnioControllers();

// GET - cargamos el anio activo
router.get('/anioactivo', ( req: Request, res: Response  ) => {

    anioControllers.cargarAnioActivo().then( ( data: any ) => {

        return res.json({
            ok: true,
            resp: data
        });

    }).catch((err: any) => {
        return res.status(500).json({
            ok: false,
            mensaje: 'ERROR SERVER'
        });
    });

});

// GET - cargamos los anios
router.get('/cargaranios', ( req: Request, res: Response  ) => {

    anioControllers.cargarAnios().then( ( data: any ) => {

        return res.json({
            ok: true,
            resp: data
        });

    }).catch((err: any) => {
        return res.status(500).json({
            ok: false,
            mensaje: 'ERROR SERVER'
        });
    });

});

export default router;