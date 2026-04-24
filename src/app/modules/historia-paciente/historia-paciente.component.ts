import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../core/paciente.service';
import { HistoriaClinica } from '../../model/vo/historiaClinica';
import { Tratamiento } from '../../model/vo/tratamiento';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from '../../model/vo/paciente';

import { NotificacionService } from '../../core/notificacion.service';

@Component({
  standalone: false,
  selector: 'app-historia-paciente',
  templateUrl: './historia-paciente.component.html',
  styleUrls: ['./historia-paciente.component.css']
})
export class HistoriaPacienteComponent implements OnInit {

  historiaClinica!: HistoriaClinica;
  historiaClinicaForm!: UntypedFormGroup;
  tratamientoForm!: UntypedFormGroup;
  pacienteId: number = 0;
  paciente!: Paciente;
  esCreacion: Boolean = false;
  historiaId: number = 0;
  esEdicion: Boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router,
    private notificacion: NotificacionService
  ) { }

  ngOnInit(): void {
    const idPaciente = parseInt(this.route.snapshot.paramMap.get('idPaciente')!);
    const idHistoria = parseInt(this.route.snapshot.paramMap.get('idHistoria')!);
    console.log('historia seleccionada paciente: {}, historia:{}', idPaciente, idHistoria);
    this.pacienteId = idPaciente;
    if (idHistoria === 0 && idPaciente !== 0) {
      this.esCreacion = true;
      this.inicializarFormularios();
    }
    if (idHistoria !== 0) {
      this.historiaId = idHistoria;
      this.cargarHistoriaClinica(this.historiaId);
    }

    this.pacienteService.getPacienteById(this.pacienteId).subscribe((response) => {
      console.log('Se obtuvo el paciente:', response);
      this.paciente = response;
    }, (error: any) => {
      console.error('Error al obtener el paciente:', error);
      this.notificacion.mostrarMensaje('Ha ocurrido un error al obtener el paciente', 'error');
    });

  }

  cargarHistoriaClinica(idHistoria: number): void {
    this.pacienteService.getHistoriaClinicaById(idHistoria).subscribe(response => {
      console.log('Se obtuvo la historia clinica:', response);
      this.historiaClinica = response;
    }, (error: any) => {
      console.error('Error al obtener la historioa clinica:', error);
      this.notificacion.mostrarMensaje('Ha ocurrido un error al obtener la historia clinica', 'error');
    });
  }

  inicializarFormularios(): void {
    this.historiaClinicaForm = this.formBuilder.group({
      id: [null],
      descripcion: ['', Validators.required],
      observacion: ['', Validators.required],
      paciente: [null],
      embarazo: [false],
      lactancia: [false],
      depilacion: [false],
      metodo: [''],
      bronceado: [false],
      fechaBronceado: [''],
      queloides: [false],
      problemasHormonales: [false],
      enfermedadCutanea: [false],
      hipertricosis: [false],
      epilepsia: [false],
      tatuaje: [false],
      coagulacion: [0, Validators.required],
      herpes: [false],
      dispositivoInterno: [false],
      zonaDispositivo: [''],
      alergias: [''],
      colorPiel: [''],
      pecas: [false],
      colorPelo: [''],
      colorOjos: [''],
      raza: [''],
      potencialQuemadura: [0, Validators.required],
      potencialBronceado: [0, Validators.required],
      fototipoPiel: [0, Validators.required],
      medicacion: [''],
      fechaMedicacion: ['']
    });

    this.tratamientoForm = this.formBuilder.group({
      id: [null],
      descripcion: ['', Validators.required],
      observacion: [''],
      antecedente: [null, Validators.required],
      tipo_tratamiento: [null, Validators.required],
      zonas_tratar: [''],
      fecha_tratamiento: [null, Validators.required],
      firma: [null, Validators.required]
    });
  }

  guardarHistoriaClinica(): void {
    if (this.historiaClinicaForm.valid) {
      this.historiaClinicaForm.value.paciente = this.paciente.id;
      const historiaClinica: HistoriaClinica = this.historiaClinicaForm.value;
      if (this.esEdicion) {
        historiaClinica.identificador = this.historiaClinica.identificador
        this.pacienteService.updateHistoriaById(historiaClinica).subscribe(response => {
          console.log('Historia clínica actualizada:', response);
          this.notificacion.mostrarMensaje('Se ha actualizado la historia clínica', 'info');
          this.historiaClinica = historiaClinica;
          this.esCreacion = false;
          this.esEdicion = false;
          this.inicializarFormularios();
        }, (error: any) => {
          console.error('Error al actualizar la historia clinica:', error);
          this.notificacion.mostrarMensaje('Ha ocurrido un error al actualizar la historia clínica', 'error');
        });
      } else {
        this.pacienteService.guardarHistoriaClinica(historiaClinica).subscribe(response => {
          console.log('Historia clínica guardada:', response);
          this.notificacion.mostrarMensaje('Se ha guardado la historia clínica', 'info');
          window.history.back();
        }, (error: any) => {
          console.error('Error al guardar la historia clínica:', error);
          this.notificacion.mostrarMensaje('Ha ocurrido un error al guardar la historia clínica', 'error');
        });
      }
    } else {
      console.log('Formulario de historia clínica no válido');
      this.notificacion.mostrarMensaje('El formulario está incompleto', 'error');
    }
  }

  agregarTratamiento(): void {
    if (this.tratamientoForm.valid) {
      const tratamiento: Tratamiento = this.tratamientoForm.value;
      this.pacienteService.agregarTratamiento(tratamiento).subscribe(response => {
        console.log('Tratamiento agregado:', response);
      }, (error: any) => {
        console.error('Error al agregar el tratamiento:', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al agregar el tratamiento', 'error');
      });
    } else {
      console.log('Formulario de tratamiento no válido');
    }
  }

  regresar() {
    console.log('regresar paciente: ', this.paciente.id);
    this.router.navigate(['/historias-clinicas', this.paciente.id]);
  }

  nuevoTratamiento() {
    console.log('regresar paciente: ', this.paciente.id);
    this.router.navigate(['/tratamiento-paciente', this.paciente.id]);
  }

  editar() {
    console.log('editar historia: ', this.historiaId);
    this.esCreacion = true;
    this.esEdicion = true;
    this.inicializarFormularios();
    this.historiaClinicaForm.patchValue(this.historiaClinica);
    this.historiaClinicaForm.value.paciente = this.paciente.id;
  }

  cancelarEdicion() {
    this.esCreacion = false;
    this.esEdicion = false;
    this.inicializarFormularios();
  }
}
