import { Component, OnInit, Input } from '@angular/core';
import {Cliente} from '../cliente';
import { ClienteService } from '../../../services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2'
import { HttpEventType } from '@angular/common/http';
import { ModalService } from 'src/app/services/detalles/modal.service';
import { AuthService } from 'src/app/services/usuarios/auth.service';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';



@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;

  titulo:string = "Detalle Cliente";

  imagenSelecionada:File;

  progeso:number;

  constructor( private clienteService: ClienteService, private activatedRoute: ActivatedRoute, public modalService:ModalService,
    public authService: AuthService,
    private facturaService: FacturaService
    
    ) {


     }

  ngOnInit(): void {
  
  }

  seleccionarFoto(event){
    this.imagenSelecionada = event.target.files[0];
    this.progeso = 0;
    console.log(this.imagenSelecionada);
    if( this.imagenSelecionada.type.indexOf('image') < 0 ){
      swal('Error seleccionar imagen','el archivo debe ser del tipo imagen', 'error' )
      this.imagenSelecionada = null;

    }
  }

  subirFoto(){
    if( !this.imagenSelecionada ){
      swal('Error Upload','Debe seleccionar una foto', 'error' )
    }else{
      this.clienteService.subirArchivo(this.imagenSelecionada,this.cliente.id).subscribe(
        event => {
          if(event.type === HttpEventType.UploadProgress ){
            this.progeso = Math.round((event.loaded/event.total)*100);
          }else if(event.type === HttpEventType.Response ){
            let response:any = event.body;
              this.cliente = response.cliente as Cliente;

            this.modalService.notificarUpload.emit(this.cliente);
            swal('La foto se ha subido completamente', `La foto se ha subido con exito : ${this.cliente.foto}`, 'success')
  
          }
          //this.cliente = cliente; 
        })
    }
  }

  delete(factura:Factura):void{
    swal({
      title: 'Esta seguro ? ',
      text: `¿ Seguro que desea eliminar la factura ${ factura.descripcion}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel plx!',
      cancelButtonClass: 'btn btn-danger',
      reverseButtons:true
    
    }).then((result) => {
      if( result.value){
        this.facturaService.delete( factura.id ).subscribe(
          () => {
            this.cliente.facturas = this.cliente.facturas.filter( f => f !== factura)
            swal(
              'Factura Eliminado !',
              `Factura ${ factura.descripcion } eliminado con exito`,
              'success'
            )
          }
        )
        
      }
    });
  }
  
  cerrarModal(){
    this.modalService.cerrarModal();
    this.imagenSelecionada = null;
    this.progeso = 0;
  }
  
}
