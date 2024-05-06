import { Component, OnInit } from '@angular/core';
interface Paciente {
  nombre: string;
  edad: number;
  sexo: string;
}
@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.css']
})
export class RegistroPacienteComponent implements OnInit {
  paciente: Paciente = {
    nombre: '',
    edad: 0,
    sexo: ''
  };
  constructor() { }

  ngOnInit(): void {
  }


  submitForm() {
    console.log('Paciente registrado:', this.paciente);
    // Aquí puedes agregar la lógica para enviar los datos a tu backend
  }

}
