import { Socket } from "socket.io";
import SocketIO from "socket.io";
import { UsuariosLista } from '../class/usuario-lista';
import { Usuario } from '../class/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarUsuario = ( usuario: Socket) => {
    const nuevoUsuario = new Usuario( usuario.id );
    usuariosConectados.agregarUsuario( nuevoUsuario );
}

export const desconectarUsuario = ( usuario: Socket ) => {
    
    usuario.on('disconnect', () => {
        console.log('Usuario Desconectado');
        usuariosConectados.eliminarUsuario( usuario.id );
    });
}

export const mensaje = ( usuario: Socket, io: SocketIO.Server ) => {

    usuario.on('mensaje', ( payload: { de: string, cuerpo: string } ) => {
        
        console.log('Mensaje Recibido', payload);

        io.emit('mensaje-nuevo', payload);

    });
}

export const configurarUsuario = ( usuario: Socket, io: SocketIO.Server ) => {

    usuario.on('configurar-usuario', ( payload: { nombre: string }, callback: Function ) => {
        
        usuariosConectados.actualizarNombre( usuario.id, payload.nombre );

        callback(`Usuario ${payload.nombre} Configurado`);

    });
}