import mysql = require('mysql');
import { DATABASES } from '../global/environment';

export default class Conexion {

    private static _instancia: Conexion;
    
    poolCluster: mysql.PoolCluster;

    constructor () { 

        this.poolCluster = mysql.createPoolCluster();
        if ( process.env.NODE_ENV == 'production' ) {
            this.poolCluster.add('altamira', DATABASES.production.altamira); 
            this.poolCluster.add('gcb', DATABASES.production.gcb);
            this.poolCluster.add('lcr', DATABASES.production.lcr);
        }else {
            this.poolCluster.add('local', DATABASES.development.localhost); 
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
                callback( null, results );
                
            });

            // console.log(query.sql);
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

                callback( results.insertId );
            
            });
        });
    }

    static ejecutarUpdate(  conexion: string, consulta: string, datos: Object, callback: Function ) {


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

                callback( results.changedRows );
            
            });
        });
    }

    static ejecutarDelete(  conexion: string, consulta: string, callback: Function ) {


        this.obtenerConexion.poolCluster.getConnection( conexion, ( errorConect: mysql.MysqlError, connection: mysql.PoolConnection ) => {

            if (errorConect){
                callback( errorConect.message ); // no conectado!
            } 
                
            connection.query( consulta, ( err, results, fields ) => {
                
                // soltar la conexion
                connection.release();

                if( err ){
                    console.log('ERROR QUERY');
                    console.log( err );
                    return callback( err );
                }

                callback( results.affectedRows  );
            
            });
        });
    }

}