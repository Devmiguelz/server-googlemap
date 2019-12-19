import { Ubicacion } from './ubicacion';


export class Mapa {

    public marcadores: Ubicacion[] = [];

    constructor() {}

    getMarcadores() {
        return this.marcadores;
    }

    agregarMarcador( marcador: Ubicacion ) {

        this.marcadores.push( marcador );

    }

    borrarMarcador( id: string ) {
        this.marcadores = this.marcadores.filter( mark => mark.id !== id );
        return this.marcadores;
    }

    moverMarcador( marcador: Ubicacion ) {

        for ( const i in this.marcadores ){

            if ( this.marcadores[i].id === marcador.id  ) {
                this.marcadores[i].latitud = marcador.latitud;
                this.marcadores[i].longitud = marcador.longitud;
                break;
            }

        }


    }
}