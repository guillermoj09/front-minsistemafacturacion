import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router,ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente();

  regiones: Region[];
  
  public titulo:string = "Crear Cliente";

  public errores:string[];

  constructor( private clienteService: ClienteService,
              private router:Router,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();

    this.clienteService.getRegiones().subscribe( regiones => this.regiones = regiones)
  }

  public cargarCliente():void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if( id ){
        this.clienteService.getCliente(id).subscribe( cliente => {
           this.cliente = cliente;
        })
      }
    })

  }

  public create():void{
    this.clienteService.create(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes'])
        console.log("respuesta" + response);
        //swal('Nuevo Cliente',` ${ response.mensaje } : ${ response.cliente.nombre } `,'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error(err.error.errors)
      }
    )
  }

  update():void {
    this.clienteService.update(this.cliente).subscribe(
      response => {
        this.router.navigate(['/cliente'])
        swal(' Cliente Actualizado',` ${ response.mensaje } : ${ response.cliente.nombre }`,'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error(err.error.errors)
      }
    )
  }

  compararRegion(o1:Region,o2:Region){
    if(o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }



}
