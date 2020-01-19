import { Ubicacion } from './ubicacion';

export class Ruta {

    constructor( 
        public codruta: number,
        public flujo: string,
        public puntoUbicacion: Ubicacion[],
    ) { } 

}