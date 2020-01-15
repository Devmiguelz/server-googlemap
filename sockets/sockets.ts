import { Socket } from "socket.io";
import SocketIO from "socket.io";
import { UsuariosLista } from '../controllers/usuario-lista';
import { Usuario } from '../models/usuario';
import { Ubicacion } from '../models/ubicacion';
import { RutaBus } from '../controllers/ruta-bus';

export const usuariosConectados = new UsuariosLista();
export const rutabus = new RutaBus();


export const usuarioActivoRuta = ( usuarioSocket: Socket, io: SocketIO.Server  ) => {

    usuarioSocket.on('emit-usuario-activo-ruta', ( ruta: { codruta: number,flujo: string } ) => {
       
        // agregamos el usuario a la sala 
        // Quedará suscrito a esa ruta
        // cuando esa ruta mita le llegara solo a los que enten suscrito
        usuarioSocket.join('ruta' + ruta.codruta + '-flujo' + ruta.flujo);

    });
}

export const usuarioDesactivoRuta = ( usuarioSocket: Socket, io: SocketIO.Server  ) => {

    usuarioSocket.on('emit-usuario-desactivo-ruta', ( ruta: { codruta: number,flujo: string }  ) => {

        // de esta forma sacamos al usuario de la sala
        // no recibirá mas punto de esa ruta
        usuarioSocket.leave('ruta' + ruta.codruta + '-flujo' + ruta.flujo);

    });
}

export const marcadorMover = ( usuarioSocket: Socket, io: SocketIO.Server ) => {

    usuarioSocket.on('emit-marcador-ruta', ( marcador: Ubicacion ) => {
        // Guardamos la ubicacion de la ruta
        rutabus.agregarUbicacionRuta(marcador.codruta, marcador.flujo, marcador); 
        // Emitimos a los usuarios que estan suscrito a esa ruta
        usuarioSocket.broadcast.to('ruta' + marcador.codruta + '-flujo' + marcador.flujo).emit('listen-marcador-ruta', marcador);

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
