import Conexion from "../database/conexion";

 export default class Ruta {

    constructor() {}

    listarRutas() {

        return new Promise(( resolve, reject ) => {
            
            const consulta = 'SELECT * FROM tra_preruta';

            Conexion.ejecutarQuery(consulta, ( err: any, results: Object[] ) => {

                if( err ) {
                    if (err) {
                        return reject( err );
                    }
                } else {
                    resolve( results );
                }
            });
        });
    }

    insertarRuta(codruta: number, flujo: string, codusuario: number, latitude: number, longitude: number) {

        return new Promise(( resolve, reject ) => {

            const consulta = 'INSERT INTO tra_preruta SET ?';

            const data = {codruta, flujo, codusuario, latitude, longitude};

            Conexion.ejecutarInsert( consulta, data, ( err: any, results: number ) => {

                if (err) {
                    return reject( err );
                }

                resolve( results );

            });

        });
    }
 }