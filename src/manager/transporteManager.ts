import Conexion from '../database/conexion';
import { Funciones } from './funciones';
import AnioManager from './anioManager';

export default class TrasnporteManager {

    anio = new AnioManager();

   constructor() {}

   /**
     * Guarda la informacion de la ruta iniciada
     * @param conexion Es el nombre del colegio.
     * @param codvehiculoruta Es la llave primaria de la tabla tra_vehiculoruta.
     * @param codusuario Codigo de suaurio que inicio la ruta.
     * @returns Retorna el ID guardado en tra_intervaloruta.
     */
    agregarInicioRuta(conexion: string, codvehiculoruta: string, codusuario: string) {

        const consulta = `INSERT INTO tra_intervaloruta(codvehiculoruta, inicioruta, codusuario) 
                            VALUES (?,?,?)`;

        const data = [codvehiculoruta, Funciones.getFechaAñoHoraActual(), codusuario];

        return new Promise((resolve, reject) => {

            Conexion.ejecutarInsert(conexion, consulta, data, (err: string, results: any) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });

        });
    }

    /**
     * Valida si la ruta esta iniciada o no.
     * @param conexion Es el nombre del colegio.
     * @param codvehiculoruta Es la llave primaria de la tabla tra_vehiculoruta.
     * @returns Si retorna informacion: la Ruta esta iniciada.
     */
    validarInicioRuta( conexion: string, codvehiculoruta: string) {
        
        const consulta = `SELECT * FROM tra_intervaloruta ir 
                        WHERE ir.codvehiculoruta=${ codvehiculoruta } 
                        AND DATE(ir.inicioruta)=DATE(NOW())`;

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
    /**
     * Guarda los puntos enviados desde la APP.
     * @param conexion Es el nombre del colegio.
     * @param codvehiculoruta Es la llave primaria de la tabla tra_vehiculoruta.
     * @param flujo Flujo de la ruta 'o'=salida - 'i'=entrada.
     * @param latitud Enviada por el GPS.
     * @param longitud Enviada por el GPS.
     * @param codusuario En caso de no ser estudainte viene el codigo del usuario.
     * @param fechaPunto Es la fecha en la fue guardado la Ubicacion.
     * @param online Por defecto '1'=online - '0'=offonline.
     * @returns Retorna el ID del registro insertado tra_ruta.
     */
    guardarTraRuta( conexion: string, codvehiculoruta: string, flujo: string, latitud: string,
        longitud: string, codusuario: string, fechaPunto: string, online: string ){

        const consulta = `INSERT INTO tra_ruta (mes, codruta, flujo, latitude, longitude, codusuario, createdday, online) 
                                    VALUES (?,?,?,?,?,?,?,?)`;
        const data = [
            Funciones.mesActual(),
            codvehiculoruta,
            flujo,
            latitud,
            longitud,
            codusuario != '' ? codusuario : null,
            fechaPunto,
            online != '' ? online : '1'
        ];

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarInsert( conexion, consulta, data, ( err: string, results: any ) => {
    
                if( err ) {
                    console.log('ERROR ' + err);
                    reject( err );
                } else {
                    resolve( results );
                }
            });
    
        });   

    }

    buscarTesRuta( conexion: string, codruta: string ) {

        const consulta = `SELECT * FROM tes_rutas WHERE cod=${ codruta }`;

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

    /**
     * Busca la informacion del tra__vehiculoruta.
     * @param conexion Es el nombre del colegio.
     * @param codvehiculoruta Es la llave primaria de la tabla tra_vehiculoruta.
     * @returns Retorna la informacion del vehiculo.
     */
    buscarRuta( conexion: string, codvehiculoruta: string ) {

        const consulta = `SELECT * FROM tra_vehiculoruta vr WHERE vr.cod=${ codvehiculoruta }`;

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

    cargarPreruta( conexion: string, codruta: string, flujo: string ) {

        const consulta = `SELECT * FROM tra_preruta pr WHERE pr.codruta=${ codruta } AND pr.flujo=${ flujo }`;

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

    buscarPreruta( conexion: string, codusuario: string, flujo: string, codruta: string ) {

        const consulta = `SELECT * FROM tra_preruta WHERE codusuario=${ codusuario } AND flujo=${ flujo } AND codruta=${ codruta }`;

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

    agregarPreruta( conexion: string, codruta: string, flujo: string, codusuario: string, 
                        orden: string, latitude: string, longitude: string ) {

        const consulta = `INSERT INTO tra_preruta (codruta,flujo,codusuario,orden,latitude,longitude) 
                        VALUES (?,?,?,?,?,?)`;

        const data = [ codruta, flujo, codusuario, orden, latitude, longitude ];

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarInsert( conexion, consulta, data, ( err: string, results: any ) => {

                if( err ) {
                    reject( err );
                } else {
                    resolve( results );
                }
            });

        });
    }

    actualizarPreruta( conexion: string, cod: string, latitide: string, longitude: string ) {

        const consulta = `UPDATE tra_preruta SET latitude=?,longitude=? WHERE cod=?`;

        const data = [latitide, longitude, cod];

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarInsert( conexion, consulta, data, ( err: string, results: any ) => {

                if( err ) {
                    reject( err );
                } else {
                    resolve( results );
                }
            });

        });  
    }

    buscarUsuarioxCodesmtumatricula( conexion: string, codestumatricula: string ) {

        const consulta = `SELECT u.* FROM aca_estumatricula aem 
            INNER JOIN est_estudiantes est ON aem.codestudiante = est.codigo 
            INNER JOIN usu_usuario u ON est.codigo = u.identificacion AND u.codtipousuario='2' 
            WHERE aem.cod=${ codestumatricula }`;

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

    /**
     * Valida si la ruta esta finalizada o no.
     * @param conexion Es el nombre del colegio.
     * @param codvehiculoruta Es la llave primaria de la tabla tra_vehiculoruta.
     * @returns Si retorna informacion: la ruta esta finalizda.
     */
    validarFinRuta( conexion: string, codvehiculoruta: string) {
        
        const consulta = `SELECT * FROM tra_intervaloruta ir 
                            WHERE ir.codvehiculoruta=${ codvehiculoruta }  
                            AND DATE(ir.finruta)=DATE(NOW())`;

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
    /**
     * Valida si la ruta esta finalizada o no.
     * @param conexion Es el nombre del colegio.
     * @param codvehiculoruta Es la llave primaria de la tabla tra_vehiculoruta.
     * @param fecha La  fecha recibida de la APP.
     * @returns Si retorna informacion: la ruta esta finalizda.
     */
    validarRutaFinalizada( conexion: string, codvehiculoruta: string, fecha: string ) {

        const consulta = `SELECT * FROM tra_intervaloruta ir 
                        INNER JOIN tra_vehiculoruta vr ON ir.codvehiculoruta=vr.cod 
                        WHERE ir.codvehiculoruta=? AND DATE(ir.finruta)=?`;

        const data = [ 
            codvehiculoruta,  
            fecha != null && fecha != '' ? Funciones.convertFechaAño(fecha) : `DATE(NOW())`
        ];

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarQueryParam( conexion, consulta, data, ( err: string, results: any ) => {

                if( err ) {
                    reject( err );
                } else {
                    resolve( results );
                }
            });
        }); 
    } 
    /**
     * Se actualiza el intervalo y se pone en finalizado
     * @param conexion Es el nombre del colegio.
     * @param codvehiculoruta Es la llave primaria de la tabla tra_vehiculoruta.
     * @param fecha La  fecha recibida de la APP.
     * @returns Retorna el numero de filas afectadas.
     */
    actualizarRutaFinalizada( conexion: string, codvehiculoruta: string, fecha: string ) {

        const consulta = `UPDATE tra_intervaloruta 
                        SET finruta=?  WHERE codvehiculoruta=? AND DATE(inicioruta)=?`;

        const data = [
            fecha != null && fecha != '' ? Funciones.convertFechaAñoMesDiaHora(fecha): Funciones.getFechaAñoHoraActual(),
            codvehiculoruta,
            fecha != null && fecha != '' ? Funciones.convertFechaAño(fecha): Funciones.fechaActualAño()
        ];

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarUpdate( conexion, consulta, data, ( err: string, results: any ) => {

                if( err ) {
                    reject( err );
                } else {
                    resolve( results );
                }
            });
        }); 
    }

    validarFinRutaFecha( conexion: string, codvehiculoruta: string, flujo: string, dia: string, fecha: string) {
        
        const consulta = `SELECT * FROM tra_intervaloruta ir INNER JOIN tra_vehiculoruta vr ON ir.codvehiculoruta=vr.cod  
                            WHERE vr.codruta=${ codvehiculoruta } AND vr.dia=${ dia } AND vr.flujo='${ flujo }' 
                            AND DATE(ir.finruta)=DATE(${ fecha })`;

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarQuery( conexion, consulta, ( err: string, results: any ) => {

                if( err ) {
                    reject('validarFinRutaFecha: ' + err );
                } else {
                    resolve( results );
                }
            });
        });        
    }
    /**
     * Valida si existe un tra_vehiculoruta con ese cod.
     * @param conexion Es el nombre del colegio.
     * @param codvehiculoruta Es la llave primaria de la tabla tra_vehiculoruta.
     * @returns Retorna Informacion de tra_vehiculoruta.
     */
    buscarVehiculoRuta( conexion: string, codvehiculoruta: string) {

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

    buscarAsistencia( conexion: string, codestumatricula: string, codusuario: string, codvehiculoruta: string, fecha: string = '' ){

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

    eliminarAsistencia( conexion: string, cod: string ) {

        const consulta = `DELETE FROM tra_asistencia WHERE cod=${ cod }`;

        return new Promise(( resolve, reject ) => {

            Conexion.ejecutarDelete( conexion, consulta, ( err: string, results: any ) => {

                if( err ) {
                    reject( err );
                } else {
                    resolve( results );
                }
            });
        });   
    }

    agregarAsistencia( conexion: string, codvehiculoruta: string, codestumatricula: string, 
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

            Conexion.ejecutarInsert( conexion, consulta, data,( err: string, results: any ) => {

                if( err ) {
                    reject( err );
                } else {
                    resolve( results );
                }
            });
        });   
    }

    actualizarNoAsistio( conexion: string, cod: string, asistio: string, 
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

            Conexion.ejecutarUpdate( conexion, consulta, data,( err: string, results: any ) => {

                if( err ) {
                    reject( err );
                } else {
                    resolve( results );
                }
            });
        });   
    }
    /**
     * Carga los padres que tengan la App instalda, sirve para el envio de notificaciones Push.
     * @param conexion Es el nombre del colegio.
     * @param codvehiculoruta Es la llave primaria de la tabla tra_vehiculoruta.
     * @param flujo Flujo de la ruta 'o'=salida - 'i'=entrada.
     * @returns Retorna los estudiantes suscritos a esta ruta.
     */
    cargaUsuarioEstudiantes( conexion: string, codvehiculoruta: string, flujo: string, callback: Function ) {
        let consulta = ``;

        this.anio.cargarAnioActivo( conexion ).then((datoAnio: any) => {
            
            if(datoAnio.length > 0 ) {
                
                const codanio = datoAnio[0].cod;
                const mes = Funciones.mesActual();

                if( flujo === 'i' ) {
                    consulta = `SELECT te.codestumatricula,u.cod'codusuarioestudiante',em.codestudiante,
                    CONCAT_WS(' ',e.primerapellido,e.primernombre)'estudiante',
                    ss.cod'codsession',ss.codigoMovil,ss.codso 
                    FROM tes_transporteestudiante te 
                    INNER JOIN tes_transestumeses tem ON tem.codtransestu=te.cod 
                    INNER JOIN tes_meses m ON tem.codmeses=m.cod 
                    INNER JOIN aca_estumatricula em ON te.codestumatricula=em.cod 
                    INNER JOIN est_estudiantes e ON em.codestudiante=e.codigo 
                    INNER JOIN usu_usuario u ON u.identificacion = e.codigo 
                    INNER JOIN not_session ss ON ss.codusuario=u.cod AND ss.estado='1' 
                    WHERE  u.codtipousuario='2' AND m.codanio=${ codanio } AND m.orden=${ mes } AND te.codruta=(SELECT codruta FROM tra_vehiculoruta WHERE cod=${ codvehiculoruta }) ORDER BY estudiante;`;
                }else {
                    consulta = `SELECT te.codestumatricula,u.cod'codusuarioestudiante',em.codestudiante,
                    CONCAT_WS(' ',e.primerapellido,e.primernombre)'estudiante',
                    ss.cod'codsession',ss.codigoMovil,ss.codso 
                    FROM tes_transporteestudiante te
                    INNER JOIN tes_transestumeses tem ON tem.codtransestu=te.cod 
                    INNER JOIN tes_meses m ON tem.codmeses=m.cod 
                    INNER JOIN aca_estumatricula em ON te.codestumatricula=em.cod 
                    INNER JOIN est_estudiantes e ON em.codestudiante=e.codigo 
                    INNER JOIN usu_usuario u ON u.identificacion = e.codigo 
                    INNER JOIN not_session ss ON ss.codusuario=u.cod AND ss.estado='1' 
                    WHERE  u.codtipousuario='2' AND m.codanio=${ codanio } AND m.orden=${ mes } AND te.codrutareparto=(SELECT codruta FROM tra_vehiculoruta WHERE cod=${ codvehiculoruta } ) ORDER BY estudiante`;
                }

                Conexion.ejecutarQuery( conexion, consulta, ( err: string, results: any ) => {

                    if( err ) {
                        callback( err );
                    } else {
                        callback( null, results );
                    }
                });
            }
        });
    }

    /**
     * Carga los padres que tengan la App instalda, sirve para el envio de notificaciones Push.
     * @param conexion Es el nombre del colegio.
     * @param codvehiculoruta Es la llave primaria de la tabla tra_vehiculoruta.
     * @param flujo Flujo de la ruta 'o'=salida - 'i'=entrada.
     * @returns Retorna los padres suscritos a esta ruta.
     */
    cargaUsuarioPadres( conexion: string, codvehiculoruta: string, flujo: string, callback: Function ) {

        let consulta = ``;

        this.anio.cargarAnioActivo( conexion ).then((datoAnio: any) => {
            
            if(datoAnio.length > 0 ) {
                
                const codanio = datoAnio[0].cod;
                const mes = Funciones.mesActual();

                if( flujo === 'i' ) {

                    consulta = `SELECT em.cod'codestumatricula',em.codestudiante,CONCAT_WS(' ',e.primerapellido,e.primernombre)'estudiante', 
                    CONCAT_WS(' ',f.apellidos,f.nombres)'familiar',tf.nombre'familiaridad',u.usuario'usuariofamiliar',u.cod'codusuariofamiliar',
                    ss.cod'codsession',ss.codigoMovil,ss.codso FROM tes_transporteestudiante te 
                    INNER JOIN tes_transestumeses tem ON tem.codtransestu=te.cod 
                    INNER JOIN tes_meses m ON tem.codmeses=m.cod 
                    INNER JOIN aca_estumatricula em ON te.codestumatricula=em.cod 
                    INNER JOIN est_estudiantes e ON em.codestudiante=e.codigo 
                    INNER JOIN est_familiareshijos fh ON fh.codestudiante=e.codigo 
                    INNER JOIN est_familiares f ON fh.codfamiliar=f.cod 
                    INNER JOIN est_tipofamiliaridad tf ON fh.codtipofamiliaridad=tf.codigo 
                    INNER JOIN usu_usuario u ON f.id=u.identificacion 
                    INNER JOIN not_session ss ON ss.codusuario=u.cod AND ss.estado='1' 
                    WHERE  u.codtipousuario='6' AND m.codanio=${ codanio }  AND m.orden=${ mes } 
                    AND te.codruta=(SELECT codruta FROM tra_vehiculoruta WHERE cod=${ codvehiculoruta }) ORDER BY estudiante`;

                }else {

                    consulta = `SELECT em.cod'codestumatricula',em.codestudiante,CONCAT_WS(' ',e.primerapellido,e.primernombre)'estudiante', 
                    CONCAT_WS(' ',f.apellidos,f.nombres)'familiar',tf.nombre'familiaridad',u.usuario'usuariofamiliar',u.cod'codusuariofamiliar',
                    ss.cod'codsession',ss.codigoMovil,ss.codso FROM tes_transporteestudiante te 
                    INNER JOIN tes_transestumeses tem ON tem.codtransestu=te.cod 
                    INNER JOIN tes_meses m ON tem.codmeses=m.cod 
                    INNER JOIN aca_estumatricula em ON te.codestumatricula=em.cod 
                    INNER JOIN est_estudiantes e ON em.codestudiante=e.codigo 
                    INNER JOIN est_familiareshijos fh ON fh.codestudiante=e.codigo 
                    INNER JOIN est_familiares f ON fh.codfamiliar=f.cod 
                    INNER JOIN est_tipofamiliaridad tf ON fh.codtipofamiliaridad=tf.codigo 
                    INNER JOIN usu_usuario u ON f.id=u.identificacion 
                    INNER JOIN not_session ss ON ss.codusuario=u.cod AND ss.estado='1' 
                    WHERE  u.codtipousuario='6' AND m.codanio=${ codanio }  AND m.orden=${ mes } 
                    AND te.codrutareparto=(SELECT codruta FROM tra_vehiculoruta WHERE cod=${ codvehiculoruta }) ORDER BY estudiante`;
                }

                Conexion.ejecutarQuery( conexion, consulta, ( err: string, results: any ) => {

                    if( err ) {
                        callback( err );
                    } else {
                        callback( null, results );
                    }
                });
            }
        });
    }

    agregarAsistenciaNoAsistio( conexion: string, codvehiculoruta: string, 
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

            Conexion.ejecutarInsert( conexion, consulta, data,( err: string, results: any ) => {

                if( err ) {
                    reject( err );
                } else {
                    resolve( results );
                }
            });
        });
    }

    /**
     * Guarda los puntos recibidos a traves de la App.
     * @param conexion Es el nombre del colegio.
     * @param codvehiculoruta Es la llave primaria de la tabla tra_vehiculoruta.
     * @param flujo Flujo de la ruta 'o'=salida - 'i'=entrada.
     * @param latitud Enviada por el GPS.
     * @param longitud Enviada por el GPS.
     * @param estumatricula Si es estudiante.
     * @param codusuario En caso de no ser estudainte viene el codigo del usuario.
     * @param online Por defecto '1'=online - '0'=offonline.
     * @returns Retorna el ID del registro guardado en la tabla 'tra_ruta'.
     */
    async agregarGeoPosicionDeRuta( conexion: string, codvehiculoruta: string, 
        flujo: string, latitud: string, longitud: string, 
        estumatricula: string, codusuario: string, online: string = '', callback: Function ) {

        this.buscarVehiculoRuta( conexion, codvehiculoruta ).then(async (datoRuta:any) => {
            if( datoRuta.length > 0 ) {

                console.log('COD RUTA ' + datoRuta[0].codruta);

                const codruta = datoRuta[0].codruta;
                const fechaPunto = Funciones.getFechaAñoHoraActualSinMM();

                let codigoUsuario = codusuario;
                if( estumatricula != null && estumatricula != '' ) {
                    await this.buscarUsuarioxCodesmtumatricula( conexion, estumatricula ).then((usuario: any) =>{
                        if( usuario.length > 0 && usuario[0].cod != null && usuario[0].cod != ''){
                            codigoUsuario = usuario[0].cod;
                        }
                    });
                    console.log('CONSULTA USUARIO');
                }

                console.log('AQUI VAMOS');

                await this.guardarTraRuta( conexion, codvehiculoruta, flujo, latitud, longitud, codigoUsuario, fechaPunto, online )
                .then((idRuta: any) => {

                    console.log('ID RUTA '+ idRuta);

                    // Validamos si insertó y si es puntos de usuario y no se seguimiento, para actualizar la geolocazación
                    if( idRuta != -1 && codigoUsuario != null && codigoUsuario != '' ) {

                        // Ahora validamos si la ruta esta habilitada para actualizar su Preruta
                        this.buscarTesRuta( conexion, codruta).then(async (datoRuta: any) => {
                            if( datoRuta.length > 0 && datoRuta[0].preruta == '1') {
                                await this.buscarPreruta(conexion, codigoUsuario, flujo, codruta).then(async (datoPreruta: any) => {
                                    if( datoPreruta.length > 0 ) {
                                        // Tiene preruta, validamos si NO tiene la geolocalización para poder actualizar
                                        if( !(datoPreruta[0].latitude != null && datoPreruta[0].latitude != '' 
                                            && datoPreruta[0].longitude != null && datoPreruta[0].longitude != "") ) {
                                            this.actualizarPreruta( conexion, datoPreruta[0].cod, latitud, longitud );
                                        }
                                        callback( null, idRuta );
                                   }else{
                                        // No tiene preruta, insertamos con el orden y la coordenada actual
                                        let orden = 0;
                                        await this.cargarPreruta( conexion,codruta, flujo ).then((datosPreruta: any) => {
                                            if( datosPreruta.length > 0 ) {
                                                orden = datosPreruta.length
                                            }else{
                                                orden++;
                                            }
                                            this.agregarPreruta( conexion, codruta, flujo, codusuario, orden.toString(), latitud, longitud);
                                        }).catch((err: any) => {
                                            callback( err );
                                        });
                                        callback( null, idRuta );
                                    }
                                }).catch((err: any) => {
                                    callback( err );
                                });
                                callback( null, idRuta );
                            }
                        }).catch((err: any) => {
                            callback( err );
                        });
                    }else{
                        callback( null, idRuta);
                    }
                });
            }else{
                callback( null, -1 );
            }
        }).catch((err: any) => {
            callback( err );
        });
    }
}
