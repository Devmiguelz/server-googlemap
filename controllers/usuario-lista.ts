import { Usuario } from '../models/usuario';
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

    public actualizarUsuario(id: string, nombre: string, codsala: number){

        for( let usuario of this.lista ) {

            if ( usuario.id === id ) {
                usuario.nombre = nombre;
                usuario.codsala = codsala;
                break;
            }

        }
        console.log('======ACTUALIZADO=======');
        console.log( this.lista );

        const tempUsuario = this.obtenerUsuario( id );
        return tempUsuario;
    }

    // Obtener lista de usuarios
    public obtenerListaUsuario() {
        return this.lista.filter( usuario => usuario.nombre !== 'sin-nombre' );
    }

    // Obtener un usuario
    public obtenerUsuario( id: string ) {

        return this.lista.find( usuario => usuario.id === id );

    }

    // Obtener usuario en una sala en particular
    public obtenerUsuarioxSala( codsala: number ) {

        return this.lista.filter( usuario => usuario.codsala === codsala );

    }

    // Borrar Usuario
    public eliminarUsuario( id: string ) {

        const tempUsuario = this.obtenerUsuario( id );

        this.lista = this.lista.filter( usuario => usuario.id !== id );

        return tempUsuario;
        
    }
}