import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io'
import http from "http";

import * as socket from "../sockets/sockets";


export default class Server {

    private static _instance:Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;


    private constructor() {

        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.escucharSockets();
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() );
    }

    private escucharSockets(){

        this.io.on('connection', usuario =>{
            console.log('Usuario Conectado');

            // Escuchar Marcador Nuevo
            socket.marcadorNuevo( usuario );

            // Escuchar Marcador Mover
            socket.marcadorMover( usuario, this.io );

            // Escuchar Marcador Borar
            socket.marcadorBorrar( usuario );



            // Conectar Usuario
            socket.conectarUsuario( usuario );

            // Configurar Usuario Login
            socket.configurarUsuario( usuario, this.io);

            // Obtener todos los Usuario activos
            socket.obtenerUsuarios( usuario, this.io);

            // Recibir Mensaje
            socket.mensaje( usuario, this.io );

            // Desconexion de un Usuario
            socket.desconectarUsuario( usuario, this.io );

        });
    }

    start(callback:Function){
        this.httpServer.listen(this.port, callback());
    }
}
