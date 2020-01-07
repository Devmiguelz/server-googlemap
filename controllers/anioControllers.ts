import Conexion from "../database/conexion";

 export default class AnioControllers {

    constructor() {}

    cargarAnios() {

        return new Promise(( resolve, reject ) => {
            
            const consulta = 'SELECT * FROM con_aniolectivo';

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
}