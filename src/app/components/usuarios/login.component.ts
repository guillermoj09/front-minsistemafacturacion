import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2'; 
import { Router }   from '@angular/router';
import { AuthService } from 'src/app/services/usuarios/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo:string = "Por favor Sign In !";

  usuario: Usuario;

  constructor( private authService:AuthService, private router:Router   ) { 
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
      if(this.authService.isAuthenticated()){
        swal('Login ',` Hola ${ this.authService.usuario.username }  ya estas autenticado`,'info')
        this.router.navigate(['/clientes']);

      }
  }
  login():void{
    console.log(this.usuario);
    if( this.usuario.username == null  || this.usuario.password == null){
      swal('Error login','Username o password vacios ','error');
      return;
    }
    this.authService.login(this.usuario).subscribe( response => {


      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;

      this.router.navigate(['/clientes']);
      swal('Login',` Hola ${ usuario.username } , has iniciado sesion con exito!`, 'success');
    }, err => {
      // si los usuarios son incorrectos 
      if ( err.status == 400 ){
        swal('Error login','Username o password incorrectas !','error');
      }
    }
    );

  }
}
