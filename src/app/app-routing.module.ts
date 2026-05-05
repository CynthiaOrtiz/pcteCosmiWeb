import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultorioContentComponent } from './modules/consultorio-content/consultorio-content.component';
import { BusquedaPacienteComponent } from './modules/busqueda-paciente/busqueda-paciente.component';
import { TratamientoPacienteComponent } from './modules/tratamiento-paciente/tratamiento-paciente.component';
import { HistoriaPacienteComponent } from './modules/historia-paciente/historia-paciente.component';
import { ListaTratamientoPacienteComponent } from './modules/lista-tratamiento-paciente/lista-tratamiento-paciente.component';
import { RegistroPacienteComponent } from './modules/registro-paciente/registro-paciente.component';
import { GestionCitasComponent } from './modules/gestion-citas/gestion-citas.component';
import { ListaHistoriasClinicasComponent } from './modules/lista-historias-clinicas/lista-historias-clinicas.component';
import { TipoTratamientoComponent } from './modules/tipo-tratamiento/tipo-tratamiento.component';
import { FacturacionComponent } from './modules/facturacion/facturacion.component';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuard } from './core/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'consultorio', component: ConsultorioContentComponent, canActivate: [AuthGuard] },
  { path: 'hom', component: ConsultorioContentComponent, canActivate: [AuthGuard] },
  { path: 'busqueda-paciente', component: BusquedaPacienteComponent, canActivate: [AuthGuard] },
  { path: 'tratamiento-paciente/:id', component: TratamientoPacienteComponent, canActivate: [AuthGuard] },
  { path: 'historias-clinicas/:id', component: ListaHistoriasClinicasComponent, canActivate: [AuthGuard] },
  { path: 'historia-clinica/:idHistoria/:idPaciente', component: HistoriaPacienteComponent, canActivate: [AuthGuard] },
  { path: 'lista-tratamientos/:id', component: ListaTratamientoPacienteComponent, canActivate: [AuthGuard] },
  { path: 'registro-paciente', component: RegistroPacienteComponent, canActivate: [AuthGuard] },
  { path: 'agendar-citas', component: GestionCitasComponent, canActivate: [AuthGuard] },
  { path: 'catalogos', component: TipoTratamientoComponent, canActivate: [AuthGuard] },
  { path: 'facturacion', component: FacturacionComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
