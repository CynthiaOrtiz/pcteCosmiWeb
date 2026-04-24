import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../core/paciente.service';
import { Paciente } from '../../model/vo/paciente';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NotificacionService } from '../../core/notificacion.service';


@Component ({
  standalone: false,
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
      cedula: ['', [Validators.maxLength(10), this.cedulaEcuatorianaValidator()]],
      pasaporte: ['', [Validators.maxLength(20)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nomCom: ['', Validators.required],
      direccion: [''],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(10)]],
      ocupacion: [''],
      genero: ['masculino'],
      email: ['', [Validators.required, Validators.email]],
      edad: ['', Validators.required],
      nacimiento: ['', Validators.required]
    }, { validators: this.cedulaOPasaporteValidator() });
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
      Object.keys(this.formularioPaciente.controls).forEach(key => {
        const controlErrors = this.formularioPaciente.get(key)?.errors;
        if (controlErrors != null) {
          console.log('Error en campo:', key, ' Detalles:', controlErrors);
        }
      });
      this.notificacion.mostrarMensaje('No se ha llenado adecuadamente el formulario', 'error');
    }
  }

  llenarNomCom(){
    let nombre = this.formularioPaciente.get('nombre')?.value || '';
    let apellido = this.formularioPaciente.get('apellido')?.value || '';
    this.formularioPaciente.get('nomCom')?.setValue(nombre.trim() + " " + apellido.trim());
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

  cedulaEcuatorianaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      if (value.length !== 10) return { cedulaLength: true };
      if (!/^[0-9]+$/.test(value)) return { cedulaPattern: true };

      const digito_region = parseInt(value.substring(0, 2), 10);
      if (digito_region < 1 || digito_region > 24) return { cedulaInvalida: true };

      const tercer_digito = parseInt(value.substring(2, 3), 10);
      if (tercer_digito >= 6) return { cedulaInvalida: true };

      const digito_verificador = parseInt(value.substring(9, 10), 10);
      let suma_pares = 0;
      let suma_impares = 0;

      for (let i = 0; i < 9; i += 2) {
        let calc = parseInt(value.charAt(i), 10) * 2;
        if (calc > 9) calc -= 9;
        suma_impares += calc;
      }

      for (let i = 1; i < 9; i += 2) {
        suma_pares += parseInt(value.charAt(i), 10);
      }

      const suma_total = suma_pares + suma_impares;
      const decena = Math.ceil(suma_total / 10) * 10;
      let digito_validador = decena - suma_total;
      if (digito_validador === 10) digito_validador = 0;

      if (digito_validador === digito_verificador) {
        return null;
      } else {
        return { cedulaInvalida: true };
      }
    };
  }

  cedulaOPasaporteValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const cedula = group.get('cedula')?.value;
      const pasaporte = group.get('pasaporte')?.value;
      if (!cedula && !pasaporte) {
        return { requiereIdentificacion: true };
      }
      return null;
    };
  }
}
