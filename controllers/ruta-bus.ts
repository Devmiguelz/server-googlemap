import { Ubicacion } from '../models/ubicacion';
import { Ruta } from '../models/ruta';

export class RutaBus {

    private listaRutasActivas: Ruta[] = [];

    constructor(){}

    activarRuta( codruta: number, flujo: string ) {

        if( this.obtenerRutaxCodruta( codruta, flujo ).length == 0 ) {
            this.listaRutasActivas.push({ codruta, flujo, puntoUbicacion:[] });
            return true;
        }else{
            return false;
        }

    }

    // Devolvemos todos los puntos de una ruta
    obtenerRutaxCodruta( codruta: number, flujo: string ) {
        return this.listaRutasActivas.filter(( ruta:Ruta ) => ruta.codruta == codruta && ruta.flujo == flujo);
    }

    // agregamos las ubicaciones a la ruta
    agregarUbicacionRuta( codruta: number, flujo: string, ubicacionNueva: Ubicacion ) {

        for (const index in this.listaRutasActivas) {
            
            if( codruta == this.listaRutasActivas[index].codruta && flujo == this.listaRutasActivas[index].flujo ) {
                this.listaRutasActivas[index].puntoUbicacion.push( ubicacionNueva );
                break;
            }
        }
    }

    // cerramos la ruta 
    cerrarRuta( codruta: number, flujo: string ) {

        const ruta = this.obtenerRutaxCodruta( codruta, flujo);

        if( ruta.length > 0 ){
            this.listaRutasActivas = this.listaRutasActivas
                .filter( (ruta:Ruta) => ruta.codruta != codruta);
            return true;
        }else{
            return false;
        }
    }

}