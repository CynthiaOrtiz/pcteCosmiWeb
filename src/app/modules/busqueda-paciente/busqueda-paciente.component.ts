import { Component, Input, OnInit } from '@angular/core';
import { PacienteService } from '../../core/paciente.service';
import { Paciente } from '../../model/vo/paciente';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificacionService } from '../../core/notificacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    private router: Router,
    private modalService: NgbModal) {
    this.pacienteForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nomCom: ['', Validators.required],
      cedula: [''],
      pasaporte: [''],
      direccion: [''],
      telefono: [null, Validators.required],
      ocupacion: [''],
      genero: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nacimiento: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // Cargar pacientes iniciales (esto podría ser reemplazado por una llamada a un servicio)

    this.cargarPacientes();
    this.pacientesFiltrados = this.pacientes;
  }

  cargarPacientes(): void {
    this.pacienteService.getPacientes().subscribe(pacientes => {
      this.pacientes = pacientes.sort((a, b) => {
        const nomA = (a.nombre || '').toLowerCase();
        const nomB = (b.nombre || '').toLowerCase();
        if (nomA < nomB) return -1;
        if (nomA > nomB) return 1;

        const apeA = (a.apellido || '').toLowerCase();
        const apeB = (b.apellido || '').toLowerCase();
        if (apeA < apeB) return -1;
        if (apeA > apeB) return 1;

        return 0;
      });
      this.pacientesFiltrados = [...this.pacientes];
    }, (error: any) => {
      console.error('Error al cargar los pacientes:', error);
      this.notificacion.mostrarMensaje('Ha ocurrido un error al cargar los pacientes', 'error');
    });
  }

  seleccionarPaciente(paciente: Paciente): void {
    this.selectedPaciente = paciente;
    this.pacienteForm.patchValue(paciente);
    const fechaNacimiento = new Date(this.selectedPaciente.nacimiento).toISOString().split('T')[0];
    this.pacienteForm.get('nacimiento')?.setValue(fechaNacimiento);
  }

  llenarNomCom(){
    let nombre = this.pacienteForm.get('nombre')?.value || '';
    let apellido = this.pacienteForm.get('apellido')?.value || '';
    this.pacienteForm.get('nomCom')?.setValue(nombre.trim() + " " + apellido.trim());
  }

  guardarCambios(): void {
    if (this.pacienteForm.valid && this.selectedPaciente) {
      const index = this.pacientes.findIndex(p => p.id === this.selectedPaciente!.id);
      const pacienteActualizado: Paciente = {
        ...this.pacienteForm.value,
        nacimiento: this.pacienteForm.get('nacimiento')?.value
      };
      this.pacienteService.updatePaciente(pacienteActualizado).subscribe(
        response => {
          console.log('Paciente actualizado:', response);
          this.cargarPacientes();
          this.selectedPaciente = null;
          this.notificacion.mostrarMensaje('Paciente actualizado', 'info');
        }, (error: any) => {
          console.error('Error al actualizar el paciente:', error);
          this.notificacion.mostrarMensaje('Ha ocurrido un error al actualizar el paciente', 'error');
        });

    }
  }

  cancelarEdicion(): void {
    this.selectedPaciente = null;
    this.pacienteForm.reset();
  }


  // historias clinicas del paciente
  verHistoriaClinica(paciente: Paciente): void {
    this.router.navigate(['/historias-clinicas', paciente.id], { state: { paciente } });
  }

  nuevoTratamiento(paciente: Paciente): void {
    this.router.navigate(['/tratamiento-paciente', paciente.id]);
  }

  verTratamientos(paciente: Paciente): void {
    this.router.navigate(['/lista-tratamientos', paciente.id]);
  }

  nuevoPaciente() {
    this.router.navigate(['/registro-paciente']);
  }

  regresar() {
    this.router.navigate(['/hom']);
  }

  home() {
    this.router.navigate(['/hom']);
  }

  pacienteAEliminar: Paciente | null = null;

  abrirModalEliminar(paciente: Paciente, modalContent: any): void {
    this.pacienteAEliminar = paciente;
    this.modalService.open(modalContent, { centered: true }).result.then(
      (result) => {
        if (result === 'Ok') {
          this.eliminarPaciente(paciente);
        }
      },
      (reason) => {
        // Modal dismissed
        this.pacienteAEliminar = null;
      }
    );
  }

  eliminarPaciente(paciente: Paciente): void {
    this.pacienteService.deletePaciente(paciente).subscribe(
      () => {
        this.notificacion.mostrarMensaje('Paciente eliminado exitosamente', 'info');
        this.selectedPaciente = null;
        this.pacienteAEliminar = null;
        this.cargarPacientes();
      },
      (error: any) => {
        console.error('Error al eliminar paciente:', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al eliminar el paciente', 'error');
      }
    );
  }

  filtrarPacientes(): void {
    this.selectedPaciente = null;
    const filtroLowerCase = this.filtro.toLowerCase();
    this.pacientesFiltrados = this.pacientes.filter(
      (paciente) =>
        paciente.cedula.toString().includes(this.filtro) ||
        paciente.nombre.toLowerCase().includes(filtroLowerCase) ||
        paciente.apellido.toLowerCase().includes(filtroLowerCase)
    );
  }
}
