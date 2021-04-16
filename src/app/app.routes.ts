import { Routes,RouterModule } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { DirectivasComponent } from './components/directivas/directivas.component';
import { FormComponent } from './components/clientes/form.component';
import { DetalleComponent } from './components/clientes/detalle/detalle.component';
import { LoginComponent } from './components/usuarios/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';

export const ROUTES: Routes = [
    { path: 'directivas' , component: DirectivasComponent},
    { path: 'clientes' , component: ClientesComponent},
    { path: 'clientes/page/:page' , component: ClientesComponent},
    { path: 'clientes/form', component: FormComponent, canActivate:[AuthGuard,RoleGuard],data: { role : 'ROLE_ADMIN'}} ,
    { path: 'clientes/form/:id', component: FormComponent,  canActivate:[AuthGuard,RoleGuard],data: { role : 'ROLE_ADMIN'} },
    { path: 'login', component: LoginComponent},
    { path: 'facturas/:id', component: DetalleFacturaComponent },
    { path: 'facturas/form/:clienteId', component: FacturasComponent },

    
    { path: '' , pathMatch: 'full' , redirectTo: 'clientes'},
    { path: '**' , pathMatch: 'full' , redirectTo: 'clientes'}
    
     

];