import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../core/paciente.service';
import { Paciente } from '../../model/vo/paciente';
import { NotificacionService } from '../../core/notificacion.service';


@Component ({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.css']
})
export class RegistroPacienteComponent implements OnInit {



  formularioPaciente!: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder,
    private pacienteService: PacienteService,
    private notificacion: NotificacionService,
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.formularioPaciente = this.formBuilder.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nomCom: ['', Validators.required],
      direccion: [''],
      telefono: [''],
      ocupacion: [''],
      genero: ['masculino'],
      email: ['', [Validators.required, Validators.email]],
      edad: ['', Validators.required],
      nacimiento: ['', Validators.required]
    });
  }


  guardarPaciente(): void {
    console.log('Guardando paciente...');
    if (this.formularioPaciente.valid) {
      const paciente: Paciente = this.formularioPaciente.value;
      this.pacienteService.guardarPaciente(paciente).subscribe(response => {
        console.log('Paciente guardado:', response);
        window.history.back();
        this.notificacion.mostrarMensaje('El paciente se ha guardado exitosamente.', 'info');
      }, (error: any) => {
        console.error('Error al guardar los pacientes:', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al guardar los pacientes', 'error');
      });
    } else {
      console.log('Formulario no válido');
      this.notificacion.mostrarMensaje('No se ha llenado correctamente el formulario', 'error');
    }
  }

  llenarNomCom(){
    let paciente: Paciente = this.formularioPaciente.value;
    this.formularioPaciente.get('nomCom')?.setValue(paciente.nombre+" "+paciente.apellido);
  }

  cancelar() {
    window.history.back();
    }

  calcularEdad() {
    let paciente: Paciente = this.formularioPaciente.value;
    let number = new Date().getFullYear() - new Date(paciente.nacimiento).getFullYear();
    let month = new Date().getMonth() - new Date(paciente.nacimiento).getMonth();
    if(month < 0){
      number = number-1;
    }
    this.formularioPaciente.get('edad')?.setValue(number);
    }
}
