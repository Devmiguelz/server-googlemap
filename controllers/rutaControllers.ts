import Conexion from '../database/conexion';

 export default class RutaControllers {

    constructor() {}

    agregarRuta(codruta: number, flujo: string, codusuario: number, latitude: number, longitude: number) {

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

    cargarRutas() {

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

    cargarRutasxCodanio( codanio: string ) {

        return new Promise(( resolve, reject ) => {

            const codanioEsc = Conexion.escapar( codanio );

            const consulta = `SELECT * FROM tes_rutas WHERE codanio = ${ codanioEsc } ORDER BY orden ASC`;

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

    cargarRutasxCod( cod: string ) {

        return new Promise(( resolve, reject ) => {

            const codanioEsc = Conexion.escapar( cod );

            const consulta = `SELECT * FROM tes_rutas WHERE cod = ${ cod } `;

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

    cargarMultiplesRutas( arrayRutas: string ) {

        return new Promise(( resolve, reject ) => {

            let where: string = '';

            const json = JSON.parse(arrayRutas);

            console.log( json.length );

            console.log( json );

            const consulta = `SELECT * FROM tes_rutas ORDER BY orden ASC`;

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