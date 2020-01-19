
export const SERVER_PORT:number = Number(process.env.PORT) || 5000;

export const DATABASES = {

    'development': { /* VARIABLES DE DESARROLLO */
        
        localhost:{
            host       : '127.0.0.1',
            user       : 'root',
            password   : '',
            database   : 'mapas',
            connectionLimit     : 10,
        }
    },
    'production': { /* VARIABLES DE PRODUCCION */

        altamira: {
            host       : '127.0.0.1',
            user       : 'root',
            password   : '',
            database   : 'altamira',
            connectionLimit     : 10,
        },
        gcb:{
            host       : '127.0.0.1',
            user       : 'root',
            password   : '',
            database   : 'gcb',
            connectionLimit     : 10,
        },
        lcr:{
            host       : '127.0.0.1',
            user       : 'root',
            password   : '',
            database   : 'gcb',
            connectionLimit     : 10,
        }
    },
};    

