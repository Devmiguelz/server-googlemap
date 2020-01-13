import mysql = require('mysql');


export default class Conexion {

    private static _instancia: Conexion;

    
    con: mysql.Connection;
    estadoConexion: boolean = false;
    
    constructor () {

        this.con = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'altamira'
          });

          this.conectarDB();
    }

    public static get obtenerConexion () {
        return this._instancia || ( this._instancia = new this() )
    }

    static ejecutarQuery( consulta: string, callback: Function ) {

        this.obtenerConexion.con.query( consulta, ( err, results: Object[], fields ) => {
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
    }

    static ejecutarInsert( consulta: string, datos: Object, callback: Function ) {

        this.obtenerConexion.con.query( consulta, datos, ( err, results, fields ) => {
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
    }

    static escapar( id: string ) {
        return this.obtenerConexion.con.escape(id);
    }

    private conectarDB() {

        this.con.connect( ( err: mysql.MysqlError) => {
            if (err) {
              console.error('ERROR: ' + err.message);
              return;
            }

            this.estadoConexion = true;
            console.log('Conexion Exitosa!');
          });
          
    }

}