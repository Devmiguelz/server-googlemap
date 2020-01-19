import moment from 'moment';

export class Funciones {

    public static convertFechaAño( fecha: string)
    {
        let fechaFormat = moment(fecha,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")
        return fechaFormat;
    }

    public static convertFechaDia( fecha: string)
    {
        let fechaFormat = moment(fecha,"YYYY-MM-DD HH:mm:ss").format("DD-MM-YYYY")
        return fechaFormat;
    }

    public static fechaActualAño() {
        return moment().format("YYYY-MM-DD");
    }

    public static fechaActualDia() {
        return moment().format("DD-MM-YYYY");
    }

    public static getFechaAñoHoraActualSinMM() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }

    public static mesActual(){
        return moment().month() + 1;
    }

}