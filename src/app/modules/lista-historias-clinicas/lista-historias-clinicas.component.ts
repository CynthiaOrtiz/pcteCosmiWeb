import { Component, OnInit } from '@angular/core';
import { HistoriaClinica } from 'src/app/model/vo/historiaClinica';
import { Router } from '@angular/router';
import { PacienteService } from '../../core/paciente.service';
import { ActivatedRoute } from '@angular/router';
import { NotificacionService } from '../../core/notificacion.service';

@Component({
  selector: 'app-lista-historias-clinicas',
  templateUrl: './lista-historias-clinicas.component.html',
  styleUrls: ['./lista-historias-clinicas.component.css']
})
export class ListaHistoriasClinicasComponent implements OnInit {

  historiasClinicas: HistoriaClinica[] = [];
  pacienteId: number = 0;
  constructor(private pacienteService: PacienteService, private router: Router,
    private route: ActivatedRoute,
    private notificacion: NotificacionService
  ) { }

  ngOnInit(): void {
    this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
    this.cargarHistoriasClinicas();
    this.historiasClinicas = [
      {
        descripcion: "string",
        observacion: "string",
        paciente: 6,
        embarazo: false,
        id: 0,
        lactancia: false,
        depilacion: false,
        metodo: '',
        bronceado: false,
        fecha_bronceado: new Date,
        queloides: false,
        problemas_hormonales: false,
        enfermedad_cutanea: false,
        hipertricosis: false,
        epilepsia: false,
        tatuaje: false,
        coagulacion: 0,
        herpes: false,
        dispositivo_interno: false,
        zona_dispositivo: '',
        alergias: '',
        color_piel: '',
        pecas: false,
        color_pelo: '',
        color_ojos: '',
        raza: '',
        potencial_quemadura: 0,
        potencial_bronceado: 0,
        fototipo_piel: 0,
        medicacion: 0,
        fecha_medicacion: new Date
      },
  ];
  }

  cargarHistoriasClinicas(): void {
    this.pacienteService.getHistoriasClinicas(this.pacienteId).subscribe(
      (data) => {
        this.historiasClinicas = data;
      }, (error: any) => {
          console.error('Error al cargar las historias clínicas', error);
          this.notificacion.mostrarMensaje('Ha ocurrido un error al cargar las hsiotrias clínicas', 'error');
      });
  }

  verHistoriaClinica(idHistoria: number): void {
    console.log('ver historia');
    idHistoria = 6;
    this.router.navigate(['/historia-clinica', idHistoria, 0]);
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
    window.history.back();
  }
}
