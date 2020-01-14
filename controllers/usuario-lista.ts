import { Usuario } from '../models/usuario';
/* Aqui se manejara toda la logica los usuario */

export class UsuariosLista{

    private lista: Usuario[] = [];
    private listaRutasActivasUsuario: { codruta: number, usuariosActivos: string[] }[] = [];

    constructor(){}

    //agregar un Usuario
    public agregarUsuario(usuario: Usuario){

        this.lista.push(usuario);

        console.log( this.lista );

        return usuario;
    }

    public actualizarUsuario( id: string, nombre: string ){

        for( let usuario of this.lista ) {

            if ( usuario.id === id ) {
                usuario.nombre = nombre;
                break;
            }

        }

        const tempUsuario = this.obtenerUsuario( id );
        return tempUsuario;
    }

    obtenerUsuarioActivoRuta( codruta: number ) {
        for (const ruta of this.listaRutasActivasUsuario) {
            if( ruta.codruta === codruta ) {
                return ruta.usuariosActivos;
                break;
            }
        }
        return null;
    }

    agregarRutaActivaUsuario( id: string, codruta: number ) {
        if( this.listaRutasActivasUsuario.length == 0 ) {
            this.listaRutasActivasUsuario.push({ codruta:codruta, usuariosActivos: [ id ] } );
        }else if( this.listaRutasActivasUsuario.find( ruta => ruta.codruta == codruta ) != undefined ){
            for (const i in this.listaRutasActivasUsuario) {
                if ( this.listaRutasActivasUsuario[i].codruta == codruta ) {
                    this.listaRutasActivasUsuario[i].usuariosActivos.push( id );    
                }
            }
        }else {
            this.listaRutasActivasUsuario.push({ codruta:codruta, usuariosActivos: [ id ] });            
        }
        console.log(this.listaRutasActivasUsuario);
    }

    quitarRutaActivaUsuario( id: string, codruta: number ) {

        for( let i in this.listaRutasActivasUsuario ) {

            if ( this.listaRutasActivasUsuario[i].codruta === codruta ) {
                this.listaRutasActivasUsuario[i].usuariosActivos = this.removerUsuarioActivo( this.listaRutasActivasUsuario[i].usuariosActivos, id );
                if( this.listaRutasActivasUsuario[i].usuariosActivos.length === 0) {
                    this.listaRutasActivasUsuario.splice(Number(i),1);  
                }
                break;
            }
        }
        console.log(this.listaRutasActivasUsuario);
    }

    removerUsuarioActivo( usuarios: string[] , id: string) {

        const i = usuarios.indexOf( id ); 
    
        if ( i !== -1 ) {
            usuarios.splice( i, 1 );
        }

        return usuarios;
    }

    public quitarUsuarioTodas( id: string ){

        for( let i in this.listaRutasActivasUsuario ) {
            this.listaRutasActivasUsuario[i].usuariosActivos = this.removerUsuarioActivo( this.listaRutasActivasUsuario[i].usuariosActivos, id );
        }
        this.listaRutasActivasUsuario = this.listaRutasActivasUsuario.filter(ruta => ruta.usuariosActivos.length > 0 );
    }

    // Obtener lista de usuarios
    public obtenerListaUsuario() {
        return this.lista.filter( usuario => usuario.nombre !== 'sin-nombre' );
    }

    // Obtener un usuario
    public obtenerUsuario( id: string ) {

        return this.lista.find( usuario => usuario.id === id );

    }

    // Borrar Usuario
    public eliminarUsuario( id: string ) {

        const tempUsuario = this.obtenerUsuario( id );

        this.lista = this.lista.filter( usuario => usuario.id !== id );

        return tempUsuario;
        
    }
}