import mysql = require('mysql');
import { DATABASES } from '../global/environment';

export default class Conexion {

    private static _instancia: Conexion;
  
    poolCluster: mysql.PoolCluster;

    constructor () { 

        this.poolCluster = mysql.createPoolCluster();
        console.log( process.env.NODE_ENV );
        if ( process.env.NODE_ENV == 'production' ) {
            this.poolCluster.add('altamira', DATABASES.production.altamira); 
            this.poolCluster.add('gcb', DATABASES.production.gcb);
            this.poolCluster.add('lcr', DATABASES.production.lcr);
        }else {
            this.poolCluster.add('altamira', DATABASES.development.altamira); 
            this.poolCluster.add('gcb', DATABASES.development.gcb);
            this.poolCluster.add('lcr', DATABASES.development.lcr);
        }

        console.log('CONEXIONES INIT');
    }

    public static get obtenerConexion( ) {
        return this._instancia || ( this._instancia = new this() )
    }

    static ejecutarQuery( conexion: string, consulta: string, callback: Function ) {

        this.obtenerConexion.poolCluster.getConnection( conexion, ( errorConect: mysql.MysqlError, connection: mysql.PoolConnection ) => {

            if (errorConect){
                callback( errorConect.message ); // no conectado!
            } 

            connection.query( consulta, ( err, results: Object[], fields ) => {

                // soltar la conexion
                connection.release();

                if( err ){
                    console.log('ERROR QUERY');
                    console.log( err );
                    return callback( err );
                }
    
                if( results.length === 0) {
                    callback('No hay registros');
                }else{
                    callback( null, results );
                }
    
            });

        });
        
    }

    static ejecutarInsert(  conexion: string, consulta: string, datos: Object, callback: Function ) {


        this.obtenerConexion.poolCluster.getConnection( conexion, ( errorConect: mysql.MysqlError, connection: mysql.PoolConnection ) => {

            if (errorConect){
                callback( errorConect.message ); // no conectado!
            } 
                
            connection.query( consulta, datos, ( err, results, fields ) => {
                
                // soltar la conexion
                connection.release();

                if( err ){
                    console.log('ERROR QUERY');
                    console.log( err );
                    return callback( err );
                }

                if( results.insertId != -1) {
                    callback( null, results.insertId );
                }else{
                    callback('Registro No Insertado');
                }

            });
        });
    }

}