import Conexion from "../database/conexion";

 export default class AnioControllers {

    constructor() {}

    cargarAnios() {

        return new Promise(( resolve, reject ) => {
            
            const consulta = 'SELECT * FROM con_aniolectivo';

            Conexion.ejecutarQuery(consulta, ( err: any, results: Object[] ) => {

                if( err ) {
                    if (err == 'No hay registros') {
                        return null;
                    }else{
                        reject( err );
                    }
                }else{ 
                    resolve( results );
                }
            });
        });
    }

    cargarAnioActivo() {

        return new Promise(( resolve, reject ) => {
            
            const consulta = "SELECT * FROM con_aniolectivo WHERE estado='On' ORDER BY anio ASC";

            Conexion.ejecutarQuery(consulta, ( err: any, results: Object[] ) => {

                if( err ) {
                    if (err == 'No hay registros') {
                        return null;
                    }else{
                        reject( err );
                    }
                }else{ 
                    resolve( results );
                }
            });
        });
    }
}