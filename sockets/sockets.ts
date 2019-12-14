import { Socket } from "socket.io";

export const desconectar = ( usuario: Socket ) => {
    
    usuario.on('disconnect', () => {
        console.log('Usuario Desconectado');
    });
}

export const mensaje = ( usuario: Socket ) => {

    usuario.on('mensaje', () => {
        console.log('Mensaje Recibido');
    });
}