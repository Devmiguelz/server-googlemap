import { Router, Request, Response } from "express";
import Server from '../class/server';

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

    //Aqui obtenemos los paramatros enviados en el body
    const codruta = req.body.codruta;
    const descripcion = req.body.descripcion;
    //Parametro enviado por la URL
    const user = req.params.user;

    //Respondemos la peticion
    res.json({
        ok:true,
        mensaje:'Method POST todo bien',
        codruta,
        descripcion,
        user
    });

});

router.post('/mensajeprivado/:id', (req:Request, res:Response) => {

    //Aqui obtenemos los paramatros enviados en el body
    const de = req.body.de;
    const cuerpo = req.body.cuerpo;
    //Parametro enviado por la URL
    const id = req.params.id;
    //Armamos el payload que se enviara a travez de socket
    const payload = { de, cuerpo }
    //instanciamos el servidor con Socket
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

    //Aqui obtenemos los paramatros enviados en el body
    const de = req.body.de;
    const cuerpo = req.body.cuerpo;
    //Parametro enviado por la URL
    const id = req.params.id;
    //Armamos el payload que se enviara a travez de socket
    const payload = { de, cuerpo }
    //instanciamos el servidor con Socket
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


export default router;