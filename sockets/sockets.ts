import { Socket } from "socket.io";
import SocketIO from "socket.io";

export const desconectar = ( usuario: Socket ) => {
    
    usuario.on('disconnect', () => {
        console.log('Usuario Desconectado');
    });
}

export const mensaje = ( usuario: Socket, io: SocketIO.Server ) => {

    usuario.on('mensaje',( payload: {de:string, cuerpo:string}) => {
        
        console.log('Mensaje Recibido', payload);

        io.emit('mensaje-nuevo', payload);

    });
}