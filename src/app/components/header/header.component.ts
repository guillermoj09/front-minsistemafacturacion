import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/usuarios/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService:AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  
  logout():void{

    let username = this.authService.usuario.username;
    this.authService.logout();
    swal('Login',`Hola ${ username } ha cerrado sesion con exito !`, 'success' ); 
    this.router.navigate(['/login']);
  }
}
