import TrasnporteManager from '../manager/transporteManager';
import UsuarioManager from '../manager/usuarioManager';
import { Funciones } from '../manager/funciones';
import moment from 'moment';
import * as socket from "../sockets/sockets";

 export default class TrasnporteControllers {

    transporte = new TrasnporteManager();
    usuario = new UsuarioManager();

    constructor() { }

    async iniciarRuta( conexion: string, codvehiculoruta: string, codusuario: string, tipoapp: string, callback: Function ) {
        let result = { success: false, message: 'No se encontro el tipo de aplicacion', codigo: 0 };
        try {
            switch ( tipoapp ) {
                case "m":
                    await this.transporte.validarInicioRuta( conexion, codvehiculoruta )
                    .then(async (datoRutaInicio: any) => {

                        console.log('VALIDAR RUTA');  
                        
                        if(datoRutaInicio.length == 0) { // La ruta no debe estar iniciada
                            
                            await this.transporte.agregarInicioRuta( conexion, codvehiculoruta, codusuario )
                            .then((codintervalo: any) => { 

                                result.success = true;
                                result.message = 'Ruta Iniciada';
                                result.codigo = codintervalo;
                                
                                if( codintervalo != -1 ) {
                                    
                                    const hora = Funciones.moment().hour();
                                    const minuto = Funciones.moment().minute();
                                    
                                    this.transporte.buscarRuta( conexion, codvehiculoruta )
                                    .then((datoRuta: any) => {
                                        if( datoRuta.length > 0 ) {
                                            console.log('BUSCAR RUTA');
                                            // Buscamos los padres para enviarle la notificacion
                                            this.transporte.cargaUsuarioPadres( conexion, codvehiculoruta, datoRuta[0].flujo, ( err: string, dataTablepadres: any) => {
                                                if( dataTablepadres.length > 0 ) {

                                                    // envio de notificaiones padres
                                                }
                                            });

                                            this.transporte.cargaUsuarioEstudiantes(conexion, codvehiculoruta, datoRuta[0].flujo, ( err: string, dataTableEstudiantes: any) => {
                                                if( dataTableEstudiantes.length > 0 ) {

                                                    // envio de notificaiones estudiantes
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }else{
                            result.message = 'Ruta ya esta iniciada';
                        }
                        console.log('RETORNA');
                        callback( null, result );
                    });
                    break;
                default:
                    callback( null, result );
                    break;
            }
        } catch (error) {
            callback(error);
        }
    }

    async detenerRuta( conexion: string, codvehiculoruta: string, fecha: string, callback: Function ) {
        let result = { success: false, message: '' };
        await this.transporte.validarRutaFinalizada( conexion, codvehiculoruta, fecha )
        .then(async (validarRutaFinalizada:any) => {
            if( validarRutaFinalizada.length == 0 ) {

                console.log("VALIDAR RUTA 1");
                
                await this.transporte.actualizarRutaFinalizada( conexion, codvehiculoruta, fecha )
                .then(async (registrosActualizados: any) => {
                    
                    console.log("REGISTRO ACT " + registrosActualizados);                    
                    
                    if(registrosActualizados > 0) {
                        
                        await this.transporte.validarRutaFinalizada( conexion, codvehiculoruta, fecha )
                        .then((datoRutaFinalizada: any) => {
                            if( datoRutaFinalizada.length > 0 ) {
                                
                                console.log("VALIDAR RUTA 2");
                                
                                result.success = true;
                                result.message = "Ruta finalizada correctamente";
                                
                                if( !Funciones.isVacia(datoRutaFinalizada[0].inicioruta) && !Funciones.isVacia(datoRutaFinalizada[0].finruta) ) {
                                    
                                    let enviarNotificaciones = false;

                                    const fechaRoads = Funciones.fechaActualAño();
                                    const mesRoads = Funciones.mesActual().toString();
                                    
                                    if( fecha != null && fecha != '') {
                                        
                                        const momentDate = moment(fecha);
                                        
                                        if( momentDate.isValid() ) { // Validamos si la fecha es valida
                                            if( momentDate.format("YYYY-MM-DD") === Funciones.fechaActualAño() ){
                                                enviarNotificaciones = true;
                                            }
                                        }
                                    }else{ enviarNotificaciones = true; }
                                    
                                    if( enviarNotificaciones ) {
                                        
                                        // ENVIO DE NOTIFICACION
                                    }
                                    
                                }
                                console.log("RETORNAMOS");
                                callback( null, result );
                            }else{
                                result.success = false;
                                result.message = "No se finalizó la ruta, comuniquese con el administrador.";
                                callback( null, result );
                            }
                        }).catch((err: any) => {callback(err);});
                    }else{
                        result.success = false;
                        result.message = "No se finalizó la ruta, comuniquese con el administrador.";
                        callback( null, result );
                    }
                }).catch((err: any) => {callback(err);});
            }else{
                // devolvemos true para que la ruta siga funcionando
                result.success = true;
                result.message = 'La ruta ya estaba cerrada.';
                callback( null, result );
            }
        }).catch((err: any) => {callback(err);});      
    }

    async guardarRutaOffline( listaSeguimiento: string, codvehiculoruta: string, fechasubir: string, conexion: string, callback: Function ) {

        let result = {
            success: false,
            cambios: 0,
            puntosRecibidos: 0,
            message : '',
            puntosSubirNoSonHoy: false,
            rutaIniciada: false,
            rutaFinalizada: false
        }
        await this.transporte.buscarVehiculoRuta( conexion, codvehiculoruta ).then(async ( datoRuta: any ) => {
                 
            if( datoRuta.length > 0 ) {

                console.log('VEHICULO RUTA');

                const fechaHoy = Funciones.fechaActualAño();
                const fechaSubir = Funciones.convertFechaAño(fechasubir);

                console.log(fechaHoy);
                console.log(fechaSubir);

                // Validamos si los puntos a subir no son de hoy
                if( fechaHoy === fechaSubir ) {

                    Promise.all([
                        await this.transporte.validarInicioRuta(conexion, codvehiculoruta),
                        await this.transporte.validarFinRuta(conexion, codvehiculoruta)
                    ]).then(async (data: any) => {

                        if(data[0].length > 0)
                            result.rutaIniciada = true;
                        if(data[1].length > 0)
                            result.rutaFinalizada = true;

                        console.log('ENTRAMOS');

                        if( result.rutaIniciada && !result.rutaFinalizada ) { // La ruta debe estar iniciada y no cerrada

                            const jsonRecibido = JSON.parse(listaSeguimiento);
                            const listaAsistencia = jsonRecibido.seguimiento;

                            const codruta = datoRuta[0].codruta;
                            const flujo = datoRuta[0].flujo;
                            const mes = Funciones.mesActual();

                            // Armamos el ID de la sala 
                            const room = 'ruta' + codvehiculoruta + 'flujo' + flujo + 'conec' + conexion;                           
                            // Emitimos  traves del evento    
                            socket.emitirSocket( room, 'listen-ubicacion-offline-ruta', listaSeguimiento);

                            for (const itemPunto of listaAsistencia) {

                                result.puntosRecibidos++;

                                console.log('FOR ' + result.puntosRecibidos);
                                
                                let codestumatricula = '';
                                let codusuario = '';

                                const codusuariounificado = itemPunto.codusuariounificado;
                                const latitud = itemPunto.latitud;
                                const longitud = itemPunto.longitud;
                                const asistio = itemPunto.asistio;    // 1= Asistio, 0=No asistio, 2=Eliminar la asistencia.
                                const createdday = itemPunto.createdday;

                                if (codusuariounificado != null && codusuariounificado != ""){
                                    await this.usuario.buscarUsuarioAsistenciaTransporte( conexion, codusuariounificado )
                                    .then(( estudiante: any) => {
                                        if( estudiante.length > 0 ) {
                                            codestumatricula = estudiante[0].codestumatricula;
                                        }else {
                                            codusuario = codusuariounificado;
                                        }
                                    });
                                }
                                // Validamos si es un punto de asistencia(tra_asistencia) o punto de seguimiento(tra_ruta)
                                if (( codestumatricula != null && codestumatricula != '') || (codusuario != null &&  codusuario != '')){

                                    await this.transporte.buscarAsistencia( conexion, codestumatricula, codusuario, codvehiculoruta, createdday)
                                    .then(async (datoAsistencia: any) => {

                                        console.log(datoAsistencia);

                                        if( datoAsistencia.length > 0 ) {
                                            if( asistio === '2' ) {
                                                await this.transporte.eliminarAsistencia( conexion, datoAsistencia[0].cod )
                                                .then(( del: any ) => {
                                                    if( del > 0 ) {
                                                        result.cambios++;
                                                    }
                                                }).catch((err: any) =>{
                                                    callback(err);
                                                });
                                                console.log('ELIMINAR ASISTENCIA: ');
                                            }else if( datoAsistencia[0].asistio != asistio ) {
                                                await this.transporte.actualizarNoAsistio(conexion, datoAsistencia[0].cod, asistio, codvehiculoruta, codestumatricula, codusuario, createdday, '0' )
                                                .then((actualizo: any) => {
                                                    if( actualizo > 0 ) {
                                                        result.cambios++;
                                                    }
                                                }).catch((err: any) =>{
                                                    callback(err);
                                                });
                                            }
                                            console.log('ACTUALIZAR ASISTENCIA: ');
                                        }else{ // No existe asistencia
                                            const cambiosOld = result.cambios;
                                            if( asistio === '1' ) {
                                                await this.transporte.agregarAsistencia( conexion,codvehiculoruta,codestumatricula,codusuario,createdday,'0' )
                                                .then((id: any)=>{
                                                    if(id !== -1) {
                                                        console.log(id);
                                                        result.cambios++;
                                                    }
                                                }).catch((err: any) => {callback(err);});
                                                console.log('AGREGAR ASISTENCIA: ');
                                            }else if( asistio === '0' ) {
                                                await this.transporte.agregarAsistenciaNoAsistio( conexion, codvehiculoruta,codestumatricula,codusuario,createdday,'0' )
                                                .then((id:any) => {
                                                    if(id !== -1) {
                                                        console.log(id);
                                                        result.cambios++;
                                                    }
                                                }).catch((err: any) => {callback(err);});
                                                console.log('AGREGAR ASISTENCIA NO: ');
                                            }
                                            if( cambiosOld != result.cambios ) {
                                                await this.transporte.agregarGeoPosicionDeRuta( conexion, codvehiculoruta, flujo, latitud, longitud, '', '', '0', (err: string, codRegistroPosicion: number) => {
                                                    if( err ) callback( err );
                                                    if( codRegistroPosicion != -1 ) {
                                                        result.cambios++;
                                                    }
                                                }).catch((err: any) => {callback(err);});
                                                console.log('1-AGREGAR GEO-POSICION: ');
                                            }
                                        }
                                    });                                                                               
                                }else if( !Funciones.isVacia(latitud) && !Funciones.isVacia(longitud) ) {
                                    await this.transporte.agregarGeoPosicionDeRuta( conexion, codvehiculoruta, flujo, latitud, longitud, '', '', '0', (err: string, codRegistroPosicion: number) =>{
                                        if( err ) callback( err );
                                        if( codRegistroPosicion != -1 ) {
                                            result.cambios++;
                                        }
                                    }).catch((err: any) => {callback(err);});
                                    console.log('2-AGREGAR GEO-POSICION: ');
                                }
                                
                            }// Fin FOR seguimiento
                            
                            console.log('VERIFICAR RESULTADOS');
                            if (result.cambios > 0) {
                                result.success = true;
                            }
                        }else{
                            if (!result.rutaIniciada) {
                                result.message = "La ruta no se encuentra iniciada.";
                            }
                            
                            if (result.rutaFinalizada) {
                                result.message = "La ruta se encuentra finalizada.";
                            }
                        }

                        callback( null, result);

                    }).catch((err: any) => {callback(err);});
                }else{
                    result.message = "Los puntos a sincronizar no son de hoy, la información ha sido eliminada.";
                    callback( null, result );
                }
            }else{
                result.message = "codvehiculoruta no existe.";
                callback( null, result);
            }
        }).catch((err: any) => {callback(err);});
    }

    guardarRutaOnline( conexion: string, codvehiculoruta: string, 
                        flujo: string, latitud: string, longitud: string, token: string, 
                        callback: Function ) {

        let result = { success: false, message: '' };
        if( this.validarToken( conexion, codvehiculoruta, flujo, latitud, longitud, token ) ){
            this.guardarRuta( conexion, codvehiculoruta, flujo, latitud, longitud, (err: string, resultado: any) => {
                if( err ) {
                    callback( err );
                }
                callback( null, resultado );
            });         
        }else{
            result.message = 'Token Invalido';
            callback( null, result );
        }
    }

    async guardarRuta( conexion: string, codvehiculoruta: string, flujo: string, latitud: string, longitud: string, callback: Function ) {

        let result = { success: false, message: '' };
        const dia = Funciones.diaSemanaActual().toString();
       
        await this.transporte.buscarVehiculoRuta( conexion, codvehiculoruta ).then(async ( datoRuta: any ) => {
                    
            if( datoRuta.length > 0 ) {
                const codruta = datoRuta[0].codruta;
                Promise.all([
                    await this.transporte.validarInicioRuta(conexion, codvehiculoruta),
                    await this.transporte.validarFinRutaFecha(conexion, codruta, flujo, dia, Funciones.fechaActualAño())
                ]).then(async (data: any) => {

                    let rutaIniciada = false;
                    let rutaFinalizada = false;

                    if(data[0].length > 0)
                        rutaIniciada = true;
                    if(data[1].length > 0)
                        rutaFinalizada = true;

                    if (rutaIniciada && !rutaFinalizada) { // La ruta debe estar iniciada y no debe estar cerrada

                        if ( !Funciones.isVacia(longitud) && !Funciones.isVacia(latitud) ) {

                            await this.transporte.agregarGeoPosicionDeRuta( conexion, codvehiculoruta, flujo, latitud, longitud, '2102', '', '', (err: string, codruta: number) => {

                                if( err ) {
                                    callback( err );
                                }

                                if( codruta != -1 ) {

                                    result.success = true;
                                    result.message = 'Posicion Guardada';

                                    // Armamos el ID de la sala 
                                    const room = 'ruta' + codvehiculoruta + 'flujo' + flujo + 'conec' + conexion;  
                                    // Armamos la data de la posicion
                                    const payload = { lat: latitud, lng: longitud };                      
                                    // Emitimos  traves del evento    
                                    socket.emitirSocket( room, 'listen-ubicacion-online-ruta', payload);
                                }else{
                                    result.message = 'No se registró la posición';
                                }
                                callback( null, result);
                            });
                        }
                    }else{
                        result.message = 'La ruta ha finalizado';
                        callback( null, result);
                    }
                }).catch((err: any) => {callback(err);});
            }else{
                callback('Vehiculo Ruta No Encontrado');
            }
        }).catch((err: any) => {callback(err);});
    }

    validarToken( conexion: string, ruta: string, flujo: string, latitud: string, longitud: string, token: string ) {

        if( Funciones.isVacia(flujo) && Funciones.isVacia(ruta) && 
            Funciones.isVacia(latitud) && Funciones.isVacia(longitud) && 
            Funciones.isVacia(conexion) && Funciones.isVacia(token) ) {
                return false;
        }

        const tokenGenerado = Funciones.getMD5("4b0g4d0s.com" + ruta + flujo + latitud + longitud + conexion);
        if( tokenGenerado === token ) {
            return true;
        }
        return false;
    }

 }