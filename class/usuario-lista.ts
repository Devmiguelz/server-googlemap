import { Usuario } from './usuario';
/* Aqui se manejara toda la logica los usuario */

export class UsuariosLista{

    private lista: Usuario[] = [];

    constructor(){}

    //agregar un Usuario
    public agregarUsuario(usuario: Usuario){
        this.lista.push(usuario);
        console.log( this.lista );
        return usuario;
    }

    public actualizarNombre(id: string, nombre: string){
        for (let usuario of this.lista) {
            if( usuario.id === id){
                usuario.nombre = nombre;
                break;
            }            
        }
        console.log('======ACTUALIZADO=======');
        console.log( this.lista );
    }
    //Listamos todos los usuarios
    public obtenerListaUsuario(){
        return this.lista;
    }
    //Buscamos el usuario por id del socket
    public buscarUsuario(id: string){
        return this.lista.find( usuario => usuario.id === id);
    }
    //Obtenemos todos los Usuairos de una sala
    public bucsarUsuariosxSala(sala: string){
        this.lista.filter(usuario => usuario.sala === sala);
    }
    //Eliminar un Usuario
    public eliminarUsuario(id: string){
        const tempUsuario = this.buscarUsuario( id );
        this.lista = this.lista.filter( usuario => { usuario.id !== id });
        return tempUsuario;
    }
}