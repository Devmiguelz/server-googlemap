

export class Usuario {

    public id: string;
    public nombre: string;
    public codsala: number;

    constructor( id: string ) { 
        
        this.id = id;
        this.nombre = 'sin-nombre';
        this.codsala   = 0;

    }

}