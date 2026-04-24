import { Component, OnInit } from '@angular/core';
import { HistoriaClinica } from '../../model/vo/historiaClinica';
import { Router } from '@angular/router';
import { PacienteService } from '../../core/paciente.service';
import { ActivatedRoute } from '@angular/router';
import { NotificacionService } from '../../core/notificacion.service';
import { Paciente } from '../../model/vo/paciente';

@Component({
  standalone: false,
  selector: 'app-lista-historias-clinicas',
  templateUrl: './lista-historias-clinicas.component.html',
  styleUrls: ['./lista-historias-clinicas.component.css']
})
export class ListaHistoriasClinicasComponent implements OnInit {

  historiasClinicas: HistoriaClinica[] = [];
  pacienteId: number = 0;
  paciente!: Paciente;
  constructor(private pacienteService: PacienteService, private router: Router,
    private route: ActivatedRoute,
    private notificacion: NotificacionService
  ) { }

  ngOnInit(): void {
    this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
    const navigation = this.router.getCurrentNavigation();
    this.paciente = navigation?.extras.state?.['paciente'];
    if (!this.paciente) {
      this.cargarPaciente();
    }
    console.log('pacienteId:', this.pacienteId);
    console.log('paciente:', this.paciente);
    this.cargarHistoriasClinicas();
  }

  private cargarPaciente() {
    this.pacienteService.getPacienteById(this.pacienteId).subscribe((response) => {
      console.log('Se obtuvo el paciente:', response);
      this.paciente = response;
    }, (error: any) => {
      console.error('Error al obtener el paciente:', error);
      this.notificacion.mostrarMensaje('Ha ocurrido un error al obtener el paciente', 'error');
    });
  }

  cargarHistoriasClinicas(): void {
    this.pacienteService.getHistoriasClinicas(this.pacienteId).subscribe(
      (data) => {
        console.log('Se obtuvieron las historias clínicas:', data);
        this.historiasClinicas = data;
      }, (error: any) => {
          console.error('Error al cargar las historias clínicas', error);
          this.notificacion.mostrarMensaje('Ha ocurrido un error al cargar las hsiotrias clínicas', 'error');
      });
  }

  verHistoriaClinica(idHistoria: number): void {
    console.log('ver historia');
    this.router.navigate(['/historia-clinica', idHistoria, this.pacienteId]);
  }

  home() {
    this.router.navigate(['/hom']);
  }

  nuevaHistoria() {
    console.log('crear historia');
    this.pacienteId = 2;
    this.router.navigate(['/historia-clinica', 0, this.pacienteId]);
  }

  regresar() {
    this.router.navigate(['/busqueda-paciente']);
  }
}
