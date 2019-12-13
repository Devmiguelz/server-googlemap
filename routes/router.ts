import { Router, Request, Response } from "express";

const router = Router();


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

    const codruta = req.body.codruta;
    const descripcion = req.body.descripcion;
    const user = req.params.user;

    res.json({
        ok:true,
        mensaje:'Method POST todo bien',
        codruta,
        descripcion,
        user
    });

});


export default router;