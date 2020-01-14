import { Socket } from "socket.io";
import SocketIO from "socket.io";
import { UsuariosLista } from '../controllers/usuario-lista';
import { Usuario } from '../models/usuario';
import { Ubicacion } from '../models/ubicacion';
import { RutaBus } from '../controllers/ruta-bus';

export const usuariosConectados = new UsuariosLista();
export const rutabus = new RutaBus();


export const usuarioActivoRuta = ( usuarioSocket: Socket, io: SocketIO.Server  ) => {

    usuarioSocket.on('emit-usuario-activo-ruta', ( codruta: number ) => {
       
        usuariosConectados.agregarRutaActivaUsuario( usuarioSocket.id, codruta );

    });
}

export const usuarioDesactivoRuta = ( usuarioSocket: Socket, io: SocketIO.Server  ) => {

    usuarioSocket.on('emit-usuario-desactivo-ruta', ( codruta: number ) => {

        usuariosConectados.quitarRutaActivaUsuario( usuarioSocket.id, codruta );

    });
}

export const marcadorMover = ( usuarioSocket: Socket, io: SocketIO.Server ) => {

    usuarioSocket.on('emit-marcador-ruta', ( marcador: Ubicacion ) => {
        
        rutabus.agregarUbicacionRuta(marcador.codruta, marcador.flujo, marcador);

        const usuarioConRutaActiva = usuariosConectados.obtenerUsuarioActivoRuta( marcador.codruta );

        if( usuarioConRutaActiva != null ) {
            console.log( usuarioConRutaActiva );
            for (let i = 0; i < usuarioConRutaActiva.length; i++) {
                // hacemos el broaskast para emitir a todo menos a el mismo
                usuarioSocket.broadcast.to( usuarioConRutaActiva[i] ).emit('listen-marcador-ruta', marcador);
            }
        }

    });
}

export const conectarUsuario = ( usuarioSocket: Socket) => {

    const nuevoUsuario = new Usuario( usuarioSocket.id );

    usuariosConectados.agregarUsuario( nuevoUsuario );

}

export const desconectarUsuario = ( usuarioSocket: Socket, io: SocketIO.Server ) => {
    
    usuarioSocket.on('disconnect', () => {

        console.log('Usuario Desconectado');

        usuariosConectados.quitarUsuarioTodas( usuarioSocket.id );

        usuariosConectados.eliminarUsuario( usuarioSocket.id );

    });
}

export const configurarUsuario = ( usuarioSocket: Socket, io: SocketIO.Server ) => {

    usuarioSocket.on('configurar-usuario', ( usuario: Usuario, callback: Function ) => {
        
        // Esta funcion me devuelve el Usuario con su ID socket
        const usuarioConfigurado = usuariosConectados.actualizarUsuario( usuarioSocket.id, usuario.nombre );
        
        // Enviamos el usuario configurado con su ID socket, se guarda en el LocalStorage
        callback(usuarioConfigurado);

    });
}
