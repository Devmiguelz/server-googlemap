import moment from 'moment';
import md5 from 'md5';

export class Funciones {

    /**
     * @param fecha recibe formato: YYYY-MM-DD HH:mm:ss
     * @returns Retorna la Fecha formato: YYYY-MM-DD
     */
    public static convertFechaAño( fecha: string)
    {
        let fechaFormat = moment(fecha,["YYYY-MM-DD HH:mm:ss"]).format("YYYY-MM-DD");
        return fechaFormat;
    }
    /**
     * @param fecha recibe formato: YYYY-MM-DD HH:mm:ss
     * @returns Retorna la Fecha formato: YYYY-MM-DD HH:mm:ss
     */
    public static convertFechaAñoMesDiaHora( fecha: string ) {
        let fechaFormat = moment(fecha,["YYYY-MM-DD HH:mm:ss"]).format("YYYY-MM-DD HH:mm:ss");
        return fechaFormat;
    }
    /**
     * @param fecha recibe formato: YYYY-MM-DD HH:mm:ss
     * @returns Retorna la Fecha formato: DD-MM-YYYY
     */
    public static convertFechaDia( fecha: string)
    {
        let fechaFormat = moment(fecha,["YYYY-MM-DD HH:mm:ss"]).format("DD-MM-YYYY");
        return fechaFormat;
    }
    /**
     * @returns Retorna la Fecha formato: YYYY-MM-DD
     */
    public static fechaActualAño() {
        return moment().format("YYYY-MM-DD");
    }
    /**
     * @returns Retorna la Fecha formato: DD-MM-YYYY
     */
    public static fechaActualDia() {
        return moment().format("DD-MM-YYYY");
    }
    /**
     * @returns Retorna la Fecha formato: YYYY-MM-DD HH:mm:ss
     */
    public static getFechaAñoHoraActualSinMM() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }
    /**
     * @returns Retorna la Fecha formato: YYYY-MM-DD HH:mm:ss
     */
    public static getFechaAñoHoraActual() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }
    /**
     * @returns Retorna el mes actual
     */
    public static mesActual(){
        return moment().month() + 1;
    }
    /**
     * @returns Retorna objeto moment
     */
    public static moment(){
        return moment();
    }
    /**
     * @returns Retorna dia de la semana
     */
    public static diaSemanaActual(){
        return moment().weekday();
    }
    /**
     * Convierte una cadena en MD%
     * @returns Retorna String MD5
     */
    public static getMD5( cadena: string ){ 
        return md5(cadena);
    }
    /**
     * Valida si la cadena esta vacia
     * @param cadena string a validar
     * @returns Retorna true Si la cadena es null | '' | undefined
     */
    public static isVacia( cadena: string ) {
        return cadena == null || cadena == '' || cadena == undefined ? true : false; 
    }

}