import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../core/paciente.service';
import { Paciente } from '../../model/vo/paciente';


@Component ({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.css']
})
export class RegistroPacienteComponent implements OnInit {
  formularioPaciente!: FormGroup;

  constructor(private formBuilder: FormBuilder, private pacienteService: PacienteService) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.formularioPaciente = this.formBuilder.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
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
    if (this.formularioPaciente.valid) {
      const paciente: Paciente = this.formularioPaciente.value;
      this.pacienteService.guardarPaciente(paciente).subscribe(response => {
        console.log('Paciente guardado:', response);
      }, error => {
        console.error('Error al guardar el paciente:', error);
      });
    } else {
      console.log('Formulario no válido');
    }
  }

}
