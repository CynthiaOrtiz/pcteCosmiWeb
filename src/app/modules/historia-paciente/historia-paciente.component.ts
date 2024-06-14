import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../core/paciente.service';
import { HistoriaClinica } from '../../model/vo/historiaClinica';
import { Tratamiento } from '../../model/vo/tratamiento';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from 'src/app/model/vo/paciente';

@Component({
  selector: 'app-historia-paciente',
  templateUrl: './historia-paciente.component.html',
  styleUrls: ['./historia-paciente.component.css']
})
export class HistoriaPacienteComponent implements OnInit {

  historiaClinicaForm!: UntypedFormGroup;
  tratamientoForm!: UntypedFormGroup;
  pacienteId: number = 0;
  paciente!: Paciente;

  constructor(private formBuilder: UntypedFormBuilder, private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.inicializarFormularios();
    this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
    this.pacienteService.getPacienteById(this.pacienteId).subscribe((response) => {
      console.log('Se obtuvo el paciente:', response);
      this.paciente = response;
    }, error => {
      console.error('Error al obtener el paciente:', error);
    });

  }

  inicializarFormularios(): void {
    this.historiaClinicaForm = this.formBuilder.group({
      id: [null],
      descripcion: ['', Validators.required],
      observacion: ['', Validators.required],
      paciente: [null, Validators.required],
      embarazo: [false],
      lactancia: [false],
      depilacion: [false],
      metodo: [''],
      bronceado: [false],
      fecha_bronceado: [''],
      queloides: [false],
      problemas_hormonales: [false],
      enfermedad_cutanea: [false],
      hipertricosis: [false],
      epilepsia: [false],
      tatuaje: [false],
      coagulacion: [0, Validators.required],
      herpes: [false],
      dispositivo_interno: [false],
      zona_dispositivo: [''],
      alergias: [''],
      color_piel: [''],
      pecas: [false],
      color_pelo: [''],
      color_ojos: [''],
      raza: [''],
      potencial_quemadura: [0, Validators.required],
      potencial_bronceado: [0, Validators.required],
      fototipo_piel: [0, Validators.required],
      medicacion: [0, Validators.required],
      fecha_medicacion: ['']
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

  regresar() {
    window.history.back();
  }
  
  nuevoTratamiento() {
    this.router.navigate(['/tratamiento-paciente', this.pacienteId]);
  }
}
