import { Ubicacion } from '../models/ubicacion';

export class RutaBus {

    private listaUbicacion: Ubicacion[] = [];

    constructor(){}

    // Devolvemos todos los puntos almacenados
    obtenerRutas() {
        return this.listaUbicacion;
    }

    // Devolvemos todos los puntos almacenados
    obtenerRutaMarcador( id: string ) {
        return this.listaUbicacion.filter( marcador => marcador.id === id );
    }

    // Agregamos la ubicacion que nos manda el Android
    public agregarUbicacionRuta( ubicacionNueva: Ubicacion ) {
        this.listaUbicacion.push( ubicacionNueva );
    }

    // Agregamos la ubicacion que nos manda el Android
    public eliminarUbicacionMarcador( id: string ) {
        this.listaUbicacion = this.listaUbicacion.
        filter( puntosUbicacion =>  puntosUbicacion.id != id);
        return this.listaUbicacion;
    }

    // Agregamos la ubicacion que nos manda el Android
    public eliminarRutas() {
        this.listaUbicacion = [];
    }

}