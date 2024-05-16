import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../core/paciente.service';
import { HistoriaClinica } from '../../model/vo/historiaClinica';
import { Tratamiento } from '../../model/vo/tratamiento';

@Component({
  selector: 'app-historia-paciente',
  templateUrl: './historia-paciente.component.html',
  styleUrls: ['./historia-paciente.component.css']
})
export class HistoriaPacienteComponent implements OnInit {
  historiaClinicaForm!: FormGroup;
  tratamientoForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private pacienteService: PacienteService) { }

  ngOnInit(): void {
    this.inicializarFormularios();
  }

  inicializarFormularios(): void {
    this.historiaClinicaForm = this.formBuilder.group({
      id: [null],
      descripcion: ['', Validators.required],
      observacion: [''],
      paciente: [null, Validators.required],
      embarazo: [0],
      lactancia: [0],
      depilacion: [0],
      metodo: [''],
      bronceado: [0],
      fecha_bronceado: [null],
      queloides: [0],
      problemas_hormonales: [0],
      enfermedad_cutanea: [''],
      hipertricosis: [''],
      epilepsia: [0],
      tatuaje: [''],
      coagulacion: [0],
      herpes: [0],
      dispositivo_interno: [''],
      zona_dispositivo: [''],
      alergias: [''],
      color_piel: [''],
      pecas: [0],
      color_pelo: [0],
      color_ojos: [0],
      raza: [0],
      potencial_quemadura: [0],
      potencial_bronceado: [0],
      fototipo_piel: [0],
      medicacion: [0],
      fecha_medicacion: [null]
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
      const historiaClinica: HistoriaClinica = this.historiaClinicaForm.value;
      this.pacienteService.guardarHistoriaClinica(historiaClinica).subscribe(response => {
        console.log('Historia clínica guardada:', response);
      }, error => {
        console.error('Error al guardar la historia clínica:', error);
      });
    } else {
      console.log('Formulario de historia clínica no válido');
    }
  }

  agregarTratamiento(): void {
    if (this.tratamientoForm.valid) {
      const tratamiento: Tratamiento = this.tratamientoForm.value;
      this.pacienteService.agregarTratamiento(tratamiento).subscribe(response => {
        console.log('Tratamiento agregado:', response);
      }, error => {
        console.error('Error al agregar el tratamiento:', error);
      });
    } else {
      console.log('Formulario de tratamiento no válido');
    }
  }
}
