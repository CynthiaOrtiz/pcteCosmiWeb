import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CitasService } from '../../core/citas.service';
import { Paciente } from '../../model/vo/paciente';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.css']
})
export class GestionCitasComponent implements OnInit {
  citaForm: UntypedFormGroup;
  pacientes: Paciente[] = [];
  citas: any[] = []; // Array para almacenar las citas

  constructor(
    private fb: UntypedFormBuilder,
    private citasService: CitasService
  ) {
    this.citaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required] // Asumiendo que tienes una lista de médicos
    });
  }

  ngOnInit(): void {
    this.loadPacientes();
    this.loadCitas();
  }

  loadPacientes(): void {
    // Llama al servicio para cargar la lista de pacientes
    this.citasService.getPacientes().subscribe(pacientes => {
      this.pacientes = pacientes;
    });
  }

  loadCitas(): void {
    // Llama al servicio para cargar la lista de citas
    this.citasService.getCitas().subscribe(citas => {
      this.citas = citas;
    });
  }

  agendarCita(): void {
    if (this.citaForm.valid) {
      const nuevaCita = this.citaForm.value;
      this.citasService.agendarCita(nuevaCita).subscribe(response => {
        alert('Cita agendada con éxito');
        this.loadCitas();
        this.citaForm.reset();
      });
    }
  }

}
