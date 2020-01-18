import Conexion from '../database/conexion';
import TrasnporteManager from '../manager/transporteManager';
import moment from 'moment';
import UsuarioManager from '../manager/usuarioManager';
import { Funciones } from '../manager/funciones';

 export default class TrasnporteControllers {

    transporte = new TrasnporteManager();
    usuarioManager = new UsuarioManager();

    constructor() { }

    iniciarRuta( codvehiculoruta: string, codusuario: string, tipoapp: string, conec: string ) {

        return new Promise(( resolve, reject ) => {
            switch ( tipoapp ) {
                case "m":
                    const datoRuta = this.transporte.validarInicioRuta( conec, codvehiculoruta );


                    resolve( datoRuta );
                    break;
            
                default:
                    break;
            }
        });
    }

    async guardarRutaOffline( listaSeguimiento: string, codvehiculoruta: string, fechasubir: string, conec: string ) {

        return new Promise(( resolve, reject ) => {

            console.log('LLEGO');

            let result = {
                success: false,
                cambios: 0,
                puntosRecibidos: 0,
                message : '',
                puntosSubirNoSonHoy: false,
                rutaIniciada: false,
                rutaFinalizada: false
            }
            this.transporte.buscarVehiculoRuta( conec, codvehiculoruta ).then(( datoRuta: any ) => {
                 
                if( datoRuta.length > 0 ) {

                    const fechaHoy = Funciones.fechaActualAño();
                    const fechaSubir = Funciones.convertFechaAño(fechasubir);

                    // Validamos si los puntos a subir no son de hoy
                    if( fechaHoy === fechaSubir ) {

                        Promise.all([
                            this.transporte.validarInicioRuta(conec, codvehiculoruta),
                            this.transporte.validarFinRuta(conec, codvehiculoruta)
                        ]).then(async (data: any) =>{

                            result.rutaIniciada = data[0].length > 0 ? true : false;
                            result.rutaFinalizada = data[1].length > 0 ? true : false;

                            if( result.rutaIniciada && !result.rutaFinalizada ) { // La ruta debe estar iniciada y no cerrada

                                const jsonRecibido = JSON.parse(listaSeguimiento);
                                const listaAsistencia = jsonRecibido.seguimiento;

                                const codruta = datoRuta[0].codruta;
                                const flujo = datoRuta[0].flujo;
                                const mes = Funciones.mesActual();

                                console.log({ RUTA: codruta, FLUJO: flujo, MES: mes });

                                for (const itemPunto of listaAsistencia) {

                                    result.puntosRecibidos++;
                                    
                                    let codestumatricula = '';
                                    let codusuario = '';

                                    const codusuariounificado = itemPunto.codusuariounificado;
                                    const latitud = itemPunto.latitud;
                                    const longitud = itemPunto.longitud;
                                    const asistio = itemPunto.asistio;    // 1= Asistio, 0=No asistio, 2=Eliminar la asistencia.
                                    const createdday = itemPunto.createdday;

                                    console.log( codusuariounificado );

                                    console.log({ LAT: latitud, LONG: longitud, ASISTIO: asistio, FECHA: createdday });

                                    if (codusuariounificado != null && codusuariounificado != ""){
                                        await this.usuarioManager.buscarUsuarioAsistenciaTransporte( conec, codusuariounificado )
                                        .then(( estudiante: any) => {
                                            if( estudiante.length > 0 ) {
                                                codestumatricula = estudiante[0].codestumatricula;
                                                console.log("CODESTUMATRICULA");
                                            }else {
                                                console.log("CODUSUARIO");
                                                codusuario = codusuariounificado;
                                            }
                                        });
                                    }
                                    if ((codestumatricula != '') || (codusuario != '')){
                                        await this.transporte.buscarAsistencia( conec, codestumatricula, codusuario, codvehiculoruta, createdday)
                                        .then(async (asistencia: any) => {
                                            console.log( asistencia );
                                            if( asistencia.length > 0 ) {
                                                if( asistio === '2' ) {
                                                    await this.transporte.eliminarAsistencia( conec, asistencia[0].cod )
                                                    .then(( del: any ) => {
                                                        if( del > 0 ) {
                                                            result.cambios++;
                                                        }
                                                        console.log('CAMBIOS');
                                                    });
                                                }else if( asistencia[0].asistio != asistio ) {
                                                    await this.transporte.actualizarNoAsistio(conec, asistencia[0].cod, asistio, codvehiculoruta, codestumatricula, codusuario, createdday, '0' )
                                                    .then((actualizo: any) => {
                                                        if( actualizo != -1 ) {
                                                            result.cambios++;
                                                        }
                                                        console.log(actualizo);
                                                        console.log('CAMBIOS');
                                                    });
                                                }
                                            }else{ // No existe asistencia
                                                const cambiosOld = result.cambios;
                                                if( asistio === '1' ) {
                                                    await this.transporte.agregarAsistencia( conec,codvehiculoruta,codestumatricula,codusuario,createdday,'0' )
                                                    .then((id: any)=>{
                                                        if(id !== -1) {
                                                            console.log(id);
                                                            result.cambios++;
                                                        }
                                                    });
                                                }else if( asistio === '0' ) {
                                                    await this.transporte.agregarAsistenciaNoAsistio( conec, codvehiculoruta,codestumatricula,codusuario,createdday,'0' )
                                                    .then((id:any) => {
                                                        if(id !== -1) {
                                                            console.log(id);
                                                            result.cambios++;
                                                        }
                                                    });
                                                }
                                                if( cambiosOld != result.cambios ) {

                                                }
                                            }
                                            console.log("ENTRO SENDO AQUI");
                                        });                                                                               
                                    }else{
                                        console.log("ENTRO SEGUNDO AQUI");
                                        
                                    }
                            
                                }

                                console.log("DESPUES AQUI");

                                if (result.cambios > 0)
                                    result.success = true;

                                resolve( result );
                            }else{
                                if (!result.rutaIniciada)
                                result.message = "La ruta no se encuentra iniciada.";
                                
                                if (result.rutaFinalizada)
                                result.message = "La ruta se encuentra finalizada.";
                            }
                            resolve( result );
                        });
                    }else{
                        result.message = "Los puntos a sincronizar no son de hoy, la información ha sido eliminada.";
                        resolve( result );
                    }
                }else{
                    result.message = "codvehiculoruta no existe.";
                    resolve( result );
                }

            });

        });   
    }










    agregarPreRuta( colegio: string, codruta: number, flujo: string, codusuario: number, orden: number, latitude: number, longitude: number) {

        const consulta = 'INSERT INTO tra_preruta SET ?';

        const data = {codruta, flujo, codusuario, orden, latitude, longitude};

        Conexion.ejecutarInsert( colegio, consulta, data, ( err: any, results: number ) => {

            if (err) {
                throw err;
            }
            
        });
    }

    cargarRutasxCodanio( colegio: string, codanio: string ) {

        return new Promise(( resolve, reject ) => {

            const consulta = `SELECT * FROM tes_rutas WHERE codanio = ${ codanio } ORDER BY orden ASC`;

            Conexion.ejecutarQuery( colegio, consulta, ( err: any, results: Object[] ) => {

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

    cargarRutasxCod( colegio: string, cod: string ) {

        return new Promise(( resolve, reject ) => {

            const consulta = `SELECT * FROM tes_rutas r WHERE r.codanio=${ cod } ORDER BY r.orden,r.nroruta`;

            Conexion.ejecutarQuery( colegio, consulta, ( err: any, results: Object[] ) => {

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

    cargarVehiculoRuta( colegio: string, codanio: number, dia: number, flujo: string) {

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

            Conexion.ejecutarQuery( colegio, consulta, ( err: any, results: Object[] ) => {

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

    async cargarEstudianteTransporte( colegio: string, codanio: string, mes: string , codvehiculoruta: string, fecha: string, flujo: string) {

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

            Conexion.ejecutarQuery( colegio, consulta, ( err: any, results: Object[] ) => {

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