import { Socket } from "socket.io";
import SocketIO from "socket.io";
import { UsuariosLista } from '../class/usuario-lista';
import { Usuario } from '../class/usuario';
import { Ubicacion } from '../class/ubicacion';
import { mapa } from '../routes/router';
import { RutaBus } from '../class/ruta-bus';

export const usuariosConectados = new UsuariosLista();
export const rutabus = new RutaBus();


export const marcadorNuevo = ( usuarioSocket: Socket ) => {

    usuarioSocket.on('emitir-marcador-nuevo', ( marcadorNuevo: Ubicacion ) => {
        mapa.agregarMarcador( marcadorNuevo );
        // hacemos el broaskast para emitir a todo menos a el mismo
        usuarioSocket.broadcast.emit('escuchar-marcador-nuevo', marcadorNuevo);
    });
}

export const marcadorMover = ( usuarioSocket: Socket, io: SocketIO.Server ) => {

    usuarioSocket.on('emitir-marcador-mover', ( marcador: Ubicacion ) => {
        mapa.moverMarcador( marcador );
        rutabus.agregarUbicacionRuta( marcador );
        // hacemos el broaskast para emitir a todo menos a el mismo
        usuarioSocket.broadcast.emit('escuchar-marcador-mover', marcador);

        io.emit('escuchar-ruta-repote', marcador);
    });
}

export const marcadorBorrar = ( usuarioSocket: Socket ) => {

    usuarioSocket.on('emitir-marcador-borrar', ( id: string ) => {
        mapa.borrarMarcador( id );
        // hacemos el broaskast para emitir a todo menos a el mismo
        usuarioSocket.broadcast.emit('escuchar-marcador-borrar', id);
    });
}






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