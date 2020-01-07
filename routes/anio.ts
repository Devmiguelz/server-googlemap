import { Router, Request, Response } from "express";
import AnioControllers from '../controllers/anioControllers';

const router = Router();
const anioControllers = new AnioControllers();

// GET - cargamos los anios
router.get('/cargaranios', ( req: Request, res: Response  ) => {

    anioControllers.cargarAnios().then( ( data: any ) => {

        if( data ) {
            return res.json({
                ok: true,
                resp: data
            });
        } else {
            return res.status(400).json({
                ok: false,
                mensaje: 'NO HAY REGISTROS'
            });
        }

    }).catch((err: any) => {
        return res.status(500).json({
            ok: false,
            mensaje: 'ERROR SERVER'
        });
    });

});

export default router;