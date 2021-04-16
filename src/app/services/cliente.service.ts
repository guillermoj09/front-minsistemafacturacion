import { Injectable } from '@angular/core';
import { CLIENTES } from '../components/clientes/clientes.json';
import { Cliente } from '../components/clientes/cliente';
import { Observable,of,throwError} from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http'
import { map, catchError,tap } from 'rxjs/operators';
import swal from 'sweetalert2'; 
import { formatDate, DatePipe } from '@angular/common';

import { Router } from '@angular/router';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Region } from '../components/clientes/region';




@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  private urlEndPoint:string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders( { 'Content-Type':'application/json'}) 

  

  constructor(private http: HttpClient, private router: Router ) { }


  /*private agregarAuthorizationHeader(){
    let token = this.authService.token;
    
    if( token != null ){ 
      return this.httpHeaders.append('Authorization', 'Bearer '+token);
    }
    return this.httpHeaders;

  }*/

  /*private isNoAutorizado(e):boolean{

    if(e.status == 401 ){
      if( this.authService.isAuthenticated()){
        this.authService.logout(); 
      }
      this.router.navigate(['/login']);
      return true;
    }

    
    if(e.status==403){
      swal('Acceso Denegado ',` Hola ${ this.authService.usuario.username }  no tienes acceso a este recurso`, 'warning')
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;
    
  }
  */
  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones');

  } 
  
  getClientes(page): Observable<any[]> {
    //return of(CLIENTES);
    return this.http.get( this.urlEndPoint + '/page/'+page  ).pipe
    (
      tap( (response:any) => {
        console.log("tap 1");
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre)
        })
      }),
      map( response => {
      (response.content as Cliente[]).map(cliente => {
        cliente.nombre = cliente.nombre.toUpperCase();
        cliente.createAt = formatDate(cliente.createAt,  'EEEE dd,MMMM yyyy','en-US')
        return cliente;
      });
       return response;
      }),
      tap( (response:any) => {
          
          console.log("tap 2");
          (response.content as Cliente[]).forEach( cliente => {
            console.log(cliente.nombre)
          })
        })

    )
  } 

  create(cliente:Cliente) :Observable<any>{
    return this.http.post<any>(this.urlEndPoint,cliente).pipe(
      map( (response:any) => response.cliente as Cliente),
      catchError( e => {

       
        if(e.status == 400){
          return throwError(e);

        }
        return throwError(e);
      })
    );
  }

  getCliente( id ): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e => {
        if(e.status != 401 ){
          this.router.navigate(['/clientes']);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);

        }
        return throwError(e);
      })
    );
  }
  update( cliente:Cliente): Observable<any> { 
    return this.http.put<any>( `${this.urlEndPoint}/${ cliente.id }`,cliente).pipe(
      catchError( e => {
     
        if(e.status == 400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);

        }
        return throwError(e);
      })
    );
  }
  
  delete( id:number ): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e => {
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  subirArchivo( archivo : File , id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id",id);
    
    const req = new HttpRequest('POST',`${this.urlEndPoint}/upload/`, formData,{
      reportProgress: true
    })


    return this.http.request(req);
    /*
    pipe(
      map((response:any) => response.cliente as Cliente),
      catchError(
        e => {
          console.error(e.error.mensaje);
          swal(e.error.mensaje,e.error.error, 'error');
          return throwError(e);
        }
      )
    );*/

  }



}
