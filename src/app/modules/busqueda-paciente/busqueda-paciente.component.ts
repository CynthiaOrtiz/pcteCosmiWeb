import { Component, Input, OnInit } from '@angular/core';
import { PacienteService } from '../../core/paciente.service';
import { Paciente } from '../../model/vo/paciente';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificacionService } from '../../core/notificacion.service';

@Component({
  selector: 'app-busqueda-paciente',
  templateUrl: './busqueda-paciente.component.html',
  styleUrls: ['./busqueda-paciente.component.css']
})
export class BusquedaPacienteComponent implements OnInit {

  pacientes: Paciente[] = [];
  selectedPaciente: Paciente | null = null;
  pacienteForm: UntypedFormGroup;
  pacientesFiltrados = [...this.pacientes];
  filtro: string = '';

  constructor(private fb: UntypedFormBuilder, private pacienteService: PacienteService,
    private notificacion: NotificacionService,
    private router: Router) {
    this.pacienteForm = this.fb.group({
      identificador: [null, Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nomCom: ['', Validators.required],
      cedula: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: [null, Validators.required],
      ocupacion: ['', Validators.required],
      genero: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nacimiento: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // Cargar pacientes iniciales (esto podría ser reemplazado por una llamada a un servicio)

    this.cargarPacientes();
    this.pacientes = [
      {
        identificador: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        nomCom: 'Juan Perez',
        cedula: '1234567890',
        direccion: 'Calle Falsa 123',
        telefono: 987654321,
        ocupacion: 'Ingeniero',
        genero: 'Masculino',
        email: 'juan.perez@example.com',
        nacimiento: new Date('1990-01-01')
      },
      // Otros pacientes...
    ];
    this.pacientesFiltrados = this.pacientes;
  }

  cargarPacientes(): void {
    this.pacienteService.getPacientes().subscribe(pacientes => {
      this.pacientes = pacientes;
      this.pacientesFiltrados = pacientes;
    }, (error: any) => {
      console.error('Error al cargar los pacientes:', error);
      this.notificacion.mostrarMensaje('Ha ocurrido un error al cargar los pacientes', 'error');
    });
  }

  seleccionarPaciente(paciente: Paciente): void {
    this.selectedPaciente = paciente;
    this.pacienteForm.patchValue(paciente);
  }

  guardarCambios(): void {
    if (this.pacienteForm.valid && this.selectedPaciente) {
      const index = this.pacientes.findIndex(p => p.identificador === this.selectedPaciente!.identificador);
      this.pacientes[index] = this.pacienteForm.value;
      this.selectedPaciente = null;
    }
  }

  cancelarEdicion(): void {
    this.selectedPaciente = null;
    this.pacienteForm.reset();
  }


  // historias clinicas del paciente
verHistoriaClinica(paciente: Paciente): void {
  this.router.navigate(['/historias-clinicas', paciente.identificador]);
}

nuevoTratamiento(paciente: Paciente): void {
  this.router.navigate(['/tratamiento-paciente', paciente.identificador]);
}

verTratamientos(paciente: Paciente): void {
  this.router.navigate(['/lista-tratamientos', paciente.identificador]);
}

nuevoPaciente() {
  this.router.navigate(['/registro-paciente']);
}

regresar() {
  window.history.back();
  }

home() {
    this.router.navigate(['/hom']);
 }

filtrarPacientes(): void {
  this.selectedPaciente = null;
    const filtroLowerCase = this.filtro.toLowerCase();
    this.pacientesFiltrados = this.pacientes.filter(
      (paciente) =>
       paciente.cedula.includes(this.filtro) ||
        paciente.nombre.toLowerCase().includes(filtroLowerCase) ||
        paciente.apellido.toLowerCase().includes(filtroLowerCase)
    );
  }
}
