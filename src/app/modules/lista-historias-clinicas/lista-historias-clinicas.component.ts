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
        identificador: 0,
        lactancia: false,
        depilacion: false,
        metodo: '',
        bronceado: false,
        fechaBronceado: new Date,
        queloides: false,
        problemasHormonales: false,
        enfermedadCutanea: false,
        hipertricosis: false,
        epilepsia: false,
        tatuaje: false,
        coagulacion: 0,
        herpes: false,
        dispositivoInterno: false,
        zonaDispositivo: '',
        alergias: '',
        colorPiel: '',
        pecas: false,
        colorPelo: '',
        colorOjos: '',
        raza: '',
        potencialQuemadura: 0,
        potencialBronceado: 0,
        fototipoPiel: 0,
        medicacion: 0,
        fechaMedicacion: new Date
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
