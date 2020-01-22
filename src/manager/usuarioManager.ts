import Conexion from '../database/conexion';
import { MysqlError } from 'mysql';

export default class UsuarioManager {

   constructor() {}

   async buscarUsuarioAsistenciaTransporte( conexion: string, codusuariounificado: string ) {

        const consulta = `SELECT em.cod 'codestumatricula', acag.cod 'codgradocurso',acag.codcurso, acag.codgrado, acag.descripcion, em.codestudiante,  
            est.primerapellido,  est.segundoapellido,est.primernombre,est.segundonombre, ip.path, acag.coddimenval 
            FROM usu_usuario usu 
            INNER JOIN  est_estudiantes est ON usu.identificacion=est.codigo AND usu.codtipousuario='2' 
            INNER JOIN aca_estumatricula em ON em.codestudiante =  est.codigo 
            INNER JOIN aca_gradoscursos acag ON  acag.cod = em.codgradoscursos 
            INNER JOIN con_aniolectivo a ON em.codanio = a.cod 
            LEFT JOIN usu_imagenperfil ip ON ip.codusuario = usu.cod  
            WHERE usu.cod=${ codusuariounificado } AND em.estado = 'On' AND a.estado= 'On'`;

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

}