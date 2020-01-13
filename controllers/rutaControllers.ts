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

            const consulta = `SELECT * FROM tes_rutas r WHERE r.codanio=${ codanioEsc } ORDER BY r.orden,r.nroruta`;

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

    cargarMultiplesRutas( arrayRutas: string[] ) {

        return new Promise(( resolve, reject ) => {

            let where: string = '';

            for (let index in arrayRutas) {
                where += ` cod=${ arrayRutas[index] } `;
                where += Number(index) != arrayRutas.length - 1 ? ' OR ' : '';
            }

            const consulta = `SELECT * FROM tes_rutas WHERE ${ where } ORDER BY orden ASC`;

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

    cargarVehiculoRuta(codanio: number, dia: number, flujo: string) {

        return new Promise(( resolve, reject ) => {

            const consulta = `SELECT vr.codruta,vr.cod 'codvehiculoruta',vr.flujo,r.nroruta,v.matricula,
            (SELECT CONCAT_WS(' ',u.apellidos,u.nombres) FROM usu_usuario u WHERE u.cod=p.codusuario AND p.codtipo='conductor') 'conductor',
            (SELECT CONCAT_WS(' ',u.apellidos,u.nombres) FROM tra_personal p INNER JOIN usu_usuario u ON p.codusuario=u.cod WHERE p.cod=vr.codauxiliar AND p.codtipo='auxiliar')'auxiliar', 
            vt.nombre 'tipovehiculo'     
            FROM tra_vehiculoruta vr 
            INNER JOIN tes_rutas r ON vr.codruta=r.cod 
            INNER JOIN tra_vehiculo v ON vr.codvehiculo=v.cod
            INNER JOIN tra_vehiculotipo vt ON v.codtipovehiculo=vt.cod
            INNER JOIN tra_personal p ON vr.codconductor=p.cod
            WHERE r.codanio=${ codanio } AND vr.dia=${ dia } AND vr.flujo=${ flujo } ORDER BY r.orden,r.nroruta `;

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

    async cargarEstudianteTransporte(codanio: string, mes: string , codvehiculoruta: string, fecha: string, flujo: string) {

        return new Promise(( resolve, reject ) => {

            let consulta = '';

            if( flujo === 'i') {
                consulta = `SELECT 
                (SELECT a.createdday FROM tra_asistencia a WHERE a.codestumatricula = em.cod 
                    AND a.codvehiculoruta =${ codvehiculoruta } 
                    AND a.fecha=CAST(${ fecha } AS DATE) LIMIT 1) 'createdday',
                (SELECT a.cod FROM tra_asistencia a WHERE a.codestumatricula = em.cod 
                    AND a.codvehiculoruta =${ codvehiculoruta } 
                    AND a.fecha=CAST(${ fecha } AS DATE) LIMIT 1) 'codasistencia',
                (SELECT a.asistio FROM tra_asistencia a WHERE a.codestumatricula = em.cod 
                    AND a.codvehiculoruta =${ codvehiculoruta } 
                    AND a.fecha=CAST(${ fecha } AS DATE) LIMIT 1) 'asistio',
                (SELECT n.cod FROM tra_novedadest n  WHERE n.codestumatricula = em.cod 
                    AND n.codvehiculoruta =${ codvehiculoruta } 
                    AND n.diaespecifico=CAST(${ fecha } AS DATE) LIMIT 1)'codnovedad',
                (SELECT n.createdday FROM tra_novedadest n  WHERE n.codestumatricula = em.cod 
                    AND n.codvehiculoruta =${ codvehiculoruta } 
                    AND n.diaespecifico=CAST(${ fecha } AS DATE) LIMIT 1)'fechanovedad',
                em.cod 'codestumatricula', 
                te.direccion,CONCAT_WS(' ',e.primerapellido,e.segundoapellido,e.primernombre,e.segundonombre)'nombreestudiante',
                ip.path,u.cod'codusuarioestudiante' 
                FROM tes_transporteestudiante te 
                INNER JOIN tes_transestumeses tem ON tem.codtransestu=te.cod 
                INNER JOIN tes_meses m ON tem.codmeses=m.cod 
                INNER JOIN tra_vehiculoruta vr ON te.codruta=vr.codruta 
                INNER JOIN tes_rutas r ON vr.codruta=r.cod 
                INNER JOIN aca_estumatricula em ON te.codestumatricula=em.cod 
                INNER JOIN est_estudiantes e ON em.codestudiante=e.codigo 
                INNER JOIN usu_usuario u ON e.codigo=u.identificacion AND u.codtipousuario='2' 
                LEFT JOIN usu_imagenperfil ip ON ip.codusuario=u.cod 
                WHERE vr.cod=${ codvehiculoruta } AND m.codanio=${ codanio } 
                AND em.codanio=${ codanio } AND r.codanio=${ codanio } AND m.orden=${ mes }
                ORDER BY nombreestudiante`
            } else {
                consulta = `SELECT (SELECT a.createdday 
                FROM tra_asistencia a WHERE a.codestumatricula = em.cod 
                AND a.codvehiculoruta =${ codvehiculoruta } 
                AND a.fecha=CAST(${ fecha } AS DATE) limit 1)'createdday',
                (SELECT a.cod FROM tra_asistencia a WHERE a.codestumatricula = em.cod 
                    AND a.codvehiculoruta =${ codvehiculoruta } 
                    AND a.fecha=CAST(${ fecha } AS DATE) limit 1) 'codasistencia',
                (SELECT a.asistio FROM tra_asistencia a WHERE a.codestumatricula = em.cod 
                    AND a.codvehiculoruta =${ codvehiculoruta } 
                    AND a.fecha=CAST(${ fecha } AS DATE) limit 1) 'asistio',
                (SELECT n.cod FROM tra_novedadest n  WHERE n.codestumatricula = em.cod 
                    AND n.codvehiculoruta =${ codvehiculoruta }  
                    AND n.diaespecifico=CAST(${ fecha } AS DATE) limit 1) 'codnovedad',
                (SELECT n.createdday FROM tra_novedadest n  WHERE n.codestumatricula = em.cod 
                    AND n.codvehiculoruta =${ codvehiculoruta }  
                    AND n.diaespecifico=CAST(${ fecha } AS DATE) limit 1) 'fechanovedad', 
                em.cod 'codestumatricula', 
                te.direccion,CONCAT_WS(' ',e.primerapellido,e.segundoapellido,e.primernombre,e.segundonombre)'nombreestudiante',
                ip.path, u.cod 'codusuarioestudiante' 
                FROM tes_transporteestudiante te 
                INNER JOIN tes_transestumeses tem ON tem.codtransestu=te.cod 
                INNER JOIN tes_meses m ON tem.codmeses=m.cod 
                INNER JOIN tra_vehiculoruta vr ON te.codrutareparto=vr.codruta  
                INNER JOIN tes_rutas r ON vr.codruta=r.cod 
                INNER JOIN aca_estumatricula em ON te.codestumatricula=em.cod 
                INNER JOIN est_estudiantes e ON em.codestudiante=e.codigo 
                INNER JOIN usu_usuario u ON e.codigo=u.identificacion AND u.codtipousuario='2' 
                LEFT JOIN usu_imagenperfil ip ON ip.codusuario=u.cod 
                WHERE vr.cod=${ codvehiculoruta } AND m.codanio=${ codanio } 
                AND em.codanio=${ codanio } AND r.codanio=${ codanio } AND m.orden=${ mes } ORDER BY nombreestudiante`;
            }

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