import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { map, catchError,tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2'
import { ModalService } from 'src/app/services/detalles/modal.service';
import { AuthService } from 'src/app/services/usuarios/auth.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {
  
  paginator:any;

  clienteSeleccionado:Cliente;

  clientes: Cliente[] = [];
  constructor( private clienteService: ClienteService, private activatedRoute: ActivatedRoute, private modalService:ModalService, 
    public authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let page:number = +params.get('page')
      
      if(!page){
        page = 0;
      }
      
      this.clienteService.getClientes(page).
      pipe(
        tap( (response:any) => {
          console.log(' clientesComponents: tap 3');
          (response.content as Cliente[]).forEach(cliente => {
            //console.log(cliente.nombre);
          })
      })
      ).subscribe( response => {
          this.clientes = response.content as Cliente[]

          console.log(response)
          this.paginator = response;
         });
    });
    this.modalService.notificarUpload.subscribe( cliente => {
        this.clientes = this.clientes.map(clienteOriginal => {
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    })
  }

  delete( cliente: Cliente ):void{
    swal({
      title: 'Esta seguro ? ',
      text: `¿ Seguro que desea eliminar al cliente ${ cliente.nombre} ${ cliente.apellido }`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel plx!',
      cancelButtonClass: 'btn btn-danger',
      reverseButtons:true
    
    }).then((result) => {
      if( result.value){
        this.clienteService.delete( cliente.id ).subscribe(
          response => {
            this.clientes = this.clientes.filter( cli => cli !== cliente)
            swal(
              'Cliente Eliminado !',
              `Cliente ${ cliente.nombre } eliminado con exito`,
              'success'
            )
          }
        )
        
      }
    });
    this.clienteService.delete( cliente.id );
  }

  abrirModal(cliente:Cliente){
    this.clienteSeleccionado = cliente;
    console.log(cliente);
    this.modalService.abrirModal();
  }
  

}