import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io'
import http from "http";

import * as webSocket from "../sockets/sockets";

export default class Server {

    private static _instance:Server;

    public app:express.Application;
    public port:number;

    public socket:socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;   

        this.httpServer = new http.Server( this.app );
        this.socket = socketIO( this.httpServer );
        this.listenSocket();
    }

    public static get instance(){
        return this._instance || ( this._instance = new this() );
    }

    private listenSocket(){
        console.log('Escuchando Socket');

        this.socket.on('connection', usuario =>{
            console.log('Usuario Conectado');
            
            //Recibir Mensaje
            webSocket.mensaje( usuario );

            //Desconexion de un Usuario
            webSocket.desconectar( usuario );

        });
    }

    start(callback:Function){
        this.httpServer.listen(this.port, callback());
    }
}
