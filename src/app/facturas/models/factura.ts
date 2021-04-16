import { ItemFactura } from './item-factura';
import { Cliente } from 'src/app/components/clientes/cliente';

export class Factura {
    id:number;
    descripcion:string;
    observacion:string;
    items: Array<ItemFactura> = [];
    cliente: Cliente;
    createAt:Date;
    total:number;

    calcularGranTotal():number{
        this.total = 0;
        this.items.forEach( (item:ItemFactura) => {
            this.total = this.total + item.calcularImporte();
        });
        return this.total;
    }
}
