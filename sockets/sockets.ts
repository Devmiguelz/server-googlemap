import { Socket } from "socket.io";
import SocketIO from "socket.io";
import { UsuariosLista } from '../class/usuario-lista';
import { Usuario } from '../class/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarUsuario = ( usuarioSocket: Socket) => {

    const nuevoUsuario = new Usuario( usuarioSocket.id );

    usuariosConectados.agregarUsuario( nuevoUsuario );

}

export const desconectarUsuario = ( usuarioSocket: Socket, io: SocketIO.Server ) => {
    
    usuarioSocket.on('disconnect', () => {

        console.log('Usuario Desconectado');

        usuariosConectados.eliminarUsuario( usuarioSocket.id );

        // Emitimos los usuario Activos
        io.emit('usuarios-activos', usuariosConectados.obtenerListaUsuario() );

    });
}

export const mensaje = ( usuarioSocket: Socket, io: SocketIO.Server ) => {

    usuarioSocket.on('mensaje', ( payload: { de: string, cuerpo: string } ) => {
        
        console.log('Mensaje Recibido', payload);

        io.emit('mensaje-nuevo', payload);

    });
}

export const configurarUsuario = ( usuarioSocket: Socket, io: SocketIO.Server ) => {

    usuarioSocket.on('configurar-usuario', ( usuario: Usuario, callback: Function ) => {
        
        // Esta funcion me devuelve el Usuario con su ID socket
        const usuarioConfigurado = usuariosConectados.actualizarUsuario( usuarioSocket.id, usuario.nombre, usuario.codsala );
        
        // Emitimos los usuario Activos
        io.emit('usuarios-activos', usuariosConectados.obtenerListaUsuario() );

        // Enviamos el usuario configurado con su ID socket, se guarda en el LocalStorage
        callback(usuarioConfigurado);

    });
}

export const obtenerUsuarios = ( usuarioSocket: Socket, io: SocketIO.Server ) => {

    usuarioSocket.on('obtener-usuarios', ( ) => {
        
        // Emitimos los usuario activos solamente a la persona que recien se conectó
        io.to( usuarioSocket.id ).emit('usuarios-activos', usuariosConectados.obtenerListaUsuario() );

    });
}