import { Socket } from "socket.io";
import SocketIO from "socket.io";
import { UsuariosLista } from '../controllers/usuario-lista';
import { Usuario } from '../models/usuario';
import { Ubicacion } from '../models/ubicacion';
import { RutaBus } from '../controllers/ruta-bus';
import Server from "../server/server";

export const usuariosConectados = new UsuariosLista();
export const rutabus = new RutaBus();

export const usuarioActivoRuta = ( usuarioSocket: Socket, io: SocketIO.Server  ) => {

    usuarioSocket.on('emit-usuario-activo-ruta', ( ruta: { codvehiculoruta: string, flujo: string, conexion: string } ) => {
       
        console.log(ruta);
        // agregamos el usuario a la sala 
        // Quedará suscrito a esa ruta
        // cuando esa ruta mita le llegara solo a los que enten suscrito
        const room = 'ruta' + ruta.codvehiculoruta + 'flujo' + ruta.flujo + 'conec' + ruta.conexion; 
        console.log(room);
        usuarioSocket.join(room);

    });
}

export const usuarioDesactivoRuta = ( usuarioSocket: Socket, io: SocketIO.Server  ) => {

    usuarioSocket.on('emit-usuario-desactivo-ruta', ( ruta: { codruta: number,flujo: string }  ) => {

        // de esta forma sacamos al usuario de la sala
        // no recibirá mas punto de esa ruta
        usuarioSocket.leave('ruta' + ruta.codruta + '-flujo' + ruta.flujo);

    });
}
/**
 * Evento para emitir socket a una sala
 * @param room Esta compuesto por: conexion-convehiculoruta-flujo
 * @param evento Nombre del evento, importante para enviarlo
 * @param payload Es la data que se envia a traves del socket
 */
export const emitirSocket = ( room: string, evento: string, payload: any ) => {

    const server = Server.instance; // Obtenemos la instancia del servidor
    // El metodo in sirve para enviar un mensaje a un canal = room
    server.io.in( room ).emit( evento, payload ); // Emitimos los puntos recibidos
}

export const marcadorMover = ( usuarioSocket: Socket, io: SocketIO.Server ) => {

    usuarioSocket.on('emit-marcador-ruta', ( marcador: Ubicacion ) => {
        
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
