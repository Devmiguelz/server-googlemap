
import Conexion from '../database/conexion';
import { MysqlError } from 'mysql';
import { Funciones } from './funciones';

export default class TrasnporteManager {

   constructor() {}

    async validarInicioRuta( conexion: string, codvehiculoruta: string) {
        
        const consulta = `SELECT * FROM tra_intervaloruta ir 
                        WHERE ir.codvehiculoruta=${ codvehiculoruta } 
                        AND DATE(ir.inicioruta)=DATE(NOW())`;

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarQuery( conexion, consulta, ( err: MysqlError, results: any ) => {

                if( err ) {
                    reject( err.message );
                } else {
                    resolve( results );
                }
            });

        });        
    }

    async buscarTesRuta( conexion: string, codruta: string ) {

        const consulta = `SELECT * FROM tes_rutas WHERE cod=${ codruta }`;

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarQuery( conexion, consulta, ( err: MysqlError, results: any ) => {

                if( err ) {
                    reject( err.message );
                } else {
                    resolve( results );
                }
            });

        });  
    }

    async agregarPreruta( conexion: string, codruta: string, flujo: string, codusuario: string, 
                        orden: string, latitude: string, longitude: string ) {

        const consulta = `INSERT INTO tra_preruta (codruta,flujo,codusuario,orden,latitude,longitude) 
                        VALUES (?,?,?,?,?,?)`;

        const data = [ codruta, flujo, codusuario, orden, latitude, longitude ];

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarInsert( conexion, consulta, data, ( err: MysqlError, results: any ) => {

                if( err ) {
                    reject( err.message );
                } else {
                    resolve( results );
                }
            });

        });
    }

    async actualizarPreruta( conexion: string, cod: string, latitide: string, longitude: string ) {

        const consulta = `UPDATE tra_preruta SET latitude=?,longitude=? WHERE cod=?`;

        const data = [latitide, longitude, cod];

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarInsert( conexion, consulta, data, ( err: MysqlError, results: any ) => {

                if( err ) {
                    reject( err.message );
                } else {
                    resolve( results );
                }
            });

        });  
    }

    async buscarUsuarioxCodesmtumatricula( conexion: string, codestumatricula: string ) {

        const consulta = `SELECT u.* FROM aca_estumatricula aem 
            INNER JOIN est_estudiantes est ON aem.codestudiante = est.codigo 
            INNER JOIN usu_usuario u ON est.codigo = u.identificacion AND u.codtipousuario='2' 
            WHERE aem.cod=${ codestumatricula }`;

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarQuery( conexion, consulta, ( err: MysqlError, results: any ) => {

                if( err ) {
                    return reject( err.message );
                } else {
                    resolve( results );
                }
            });
        });  

    }

    async validarFinRuta( conexion: string, codvehiculoruta: string) {
        
        const consulta = `SELECT * FROM tra_intervaloruta ir 
                            WHERE ir.codvehiculoruta=${ codvehiculoruta }  
                            AND DATE(ir.finruta)=DATE(NOW())`;

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarQuery( conexion, consulta, ( err: MysqlError, results: any ) => {

                if( err ) {
                    return reject( err.message );
                } else {
                    resolve( results );
                }
            });
        });        
    }

    async buscarVehiculoRuta( conexion: string, codvehiculoruta: string) {

        const consulta = `SELECT vr.*,r.nroruta,v.matricula 
                            FROM tra_vehiculoruta vr 
                            INNER JOIN tes_rutas r ON vr.codruta=r.cod 
                            INNER JOIN tra_vehiculo v ON vr.codvehiculo=v.cod 
                            WHERE vr.cod=${ codvehiculoruta }`;

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarQuery( conexion, consulta, ( err: string, results: any ) => {

                if( err ) {
                    reject( err );
                } else {
                    resolve( results );
                }
            });
        });
    }

    async buscarAsistencia( conexion: string, codestumatricula: string, codusuario: string, codvehiculoruta: string, fecha?: string ){

        let consulta = '';
        let campoString = '';
        let cod = '';

        const fechaConsulta = fecha != null && fecha != '' ? Funciones.convertFechaAño(fecha) : Funciones.fechaActualAño();

        if (codestumatricula != '') {
            cod = codestumatricula;
            campoString = ' t.codestumatricula';
        }else if (codusuario != '') {
            cod = codusuario;
            campoString = ' t.codusuario';
        }

        consulta = `SELECT * FROM tra_asistencia t 
        WHERE t.codvehiculoruta =${ codvehiculoruta } AND ${ campoString }=${ cod } 
        AND DATE(t.fecha)=DATE(${ fechaConsulta })`;

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarQuery( conexion, consulta, ( err: string, results: any ) => {

                if( err ) {
                    reject( err );
                } else {
                    resolve( results );
                }
            });

        });
    }

    async eliminarAsistencia( conexion: string, cod: string ) {

        const consulta = `DELETE FROM tra_asistencia WHERE cod=${ cod }`;

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarDelete( conexion, consulta, ( err: MysqlError, results: any ) => {

                if( err ) {
                    return reject( err.message );
                } else {
                    resolve( results );
                }
            });
        });   
    }

    async agregarAsistencia( conexion: string, codvehiculoruta: string, codestumatricula: string, 
                             codusuario: string, createdday: string = '', online: string = '' ) {
        
        const consulta = `INSERT INTO tra_asistencia (codvehiculoruta,fecha,codestumatricula,codusuario,createdday,online) 
                        VALUES (?,?,?,?,?,?)`;


        const data  = [
            codvehiculoruta, 
            createdday != '' ? Funciones.convertFechaAño(createdday) : Funciones.fechaActualAño(),
            codestumatricula != '' ? codestumatricula : null,
            codusuario != '' ? codusuario : null,
            createdday != '' ? Funciones.convertFechaAño(createdday) : Funciones.fechaActualAño(),
            online != '' ? online : '1'
        ];

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarInsert( conexion, consulta, data,( err: MysqlError, results: any ) => {

                if( err ) {
                    return reject( err.message );
                } else {
                    resolve( results );
                }
            });
        });   
    }

    async actualizarNoAsistio( conexion: string, cod: string, asistio: string, 
                            codvehiculoruta: string, codestumatricula: string, codusuario: string, 
                            createdday: string = '', online: string = '' ) {
        
        const consulta = `UPDATE tra_asistencia 
        SET  codvehiculoruta=?, fecha=?, codestumatricula=?, codusuario=?, createdday=?, asistio=?,online=? WHERE cod=?`;


        const data  = [
            codvehiculoruta, 
            Funciones.fechaActualAño(),
            codestumatricula != '' ? codestumatricula : null,
            codusuario != '' ? codusuario : null,
            createdday != '' ? Funciones.convertFechaAño(createdday) : Funciones.fechaActualAño(),
            asistio,
            online != '' ? online : '1',
            cod
        ];

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarUpdate( conexion, consulta, data,( err: MysqlError, results: any ) => {

                if( err ) {
                    return reject( err.message );
                } else {
                    resolve( results );
                }
            });
        });   
    }

    async agregarAsistenciaNoAsistio( conexion: string, codvehiculoruta: string, 
        codestumatricula: string, codusuario: string, 
        createdday: string = '', online: string = '' ) {
        
        const consulta = `INSERT INTO tra_asistencia (codvehiculoruta, fecha, codestumatricula, codusuario, createdday, asistio, online)  
                        VALUES (?,?,?,?,?,?,?)`;

        const data  = [
            codvehiculoruta, 
            createdday != '' ? Funciones.convertFechaAño(createdday) : Funciones.fechaActualAño(),
            codestumatricula != '' ? codestumatricula : null,
            codusuario != '' ? codusuario : null,
            createdday != '' ? Funciones.convertFechaAño(createdday) : Funciones.fechaActualAño(),
            0,
            online != '' ? online : '1'
        ];

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarInsert( conexion, consulta, data,( err: MysqlError, results: any ) => {

                if( err ) {
                    return reject( err.message );
                } else {
                    resolve( results );
                }
            });
        });
    }

    async agregarGeoPosicionDeRuta( conexion: string, codvehiculoruta: string, 
        flujo: string, latitud: string, longitud: string, 
        estumatircula: string, codusuario: string, online: string = '' ) {

        return new Promise(( resolve, reject ) => {

            this.buscarVehiculoRuta( conexion, codvehiculoruta ).then((datoRuta:any) =>{
                if( datoRuta.length > 0 ) {

                    const codruta = datoRuta[0].codruta;
                    const fechaPunto = Funciones.getFechaAñoHoraActualSinMM();

                    let codigoUsuario = codusuario;

                    if( estumatircula != null && estumatircula != '' ) {
                        this.buscarUsuarioxCodesmtumatricula( conexion, estumatircula ).then((usuario: any) =>{
                            if( usuario.length > 0 ){
                                codigoUsuario = usuario[0].cod;
                            }
                        });
                    }

                    const consulta = `INSERT INTO tra_ruta (mes,codruta, flujo,latitude,longitude,codusuario,createdday,online) 
                                        VALUES (?,?,?,?,?,?,?,?)`;

                    const data = [
                        Funciones.mesActual(),
                        codruta,
                        flujo,
                        latitud,
                        longitud,
                        codigoUsuario != '' ? codigoUsuario : null,
                        online != '' ? online : '1',
                        fechaPunto
                    ];

                    Conexion.ejecutarInsert( conexion, consulta, data,( err: MysqlError, results: any ) => {

                        if( err ) {
                            return reject( err.message );
                        } else {

                            if( results != -1 && codigoUsuario != null && codigoUsuario != '' ) {
                                this.buscarTesRuta( conexion, codruta).then((datoRuta: any) => {

                                    if( datoRuta.length > 0 && datoRuta[0].preruta == '1') {

                                    }else{

                                    }

                                });
                            }
                        }
                    });


                }else{
                    resolve(-1);
                }
            });
        });
    }
}
