import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
export interface Paciente {
  cedula: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  ocupacion: string;
  genero: string;
  email: string;
  edad: number;
  nacimiento: Date;
}
@Component({
  selector: 'app-busqueda-paciente',
  templateUrl: './busqueda-paciente.component.html',
  styleUrls: ['./busqueda-paciente.component.css']
})
export class BusquedaPacienteComponent implements OnInit {
  paciente: Paciente = {
    nombre: '',
    edad: 0,
    genero: '',
    cedula: '',
    apellido: '',
    direccion: '',
    telefono: '',
    ocupacion: '',
    email: '',
    nacimiento: new Date
  };

  public pacientes:[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.http
      .get('http://localhost:8080/example-assets/small-row-data.json')
      .subscribe(data => {
        console.log('buscar pacientes TODOS: ', data);
      });
  }

  buscarPaciente() {
    let paciente = new Paciente(
      111111111111,
      'asidhaosudhais',
      'sdfghsdfgfgh',
      'sdfgdfgdfg',
      654654,
      'sdfgsdfg',
      'sdfgsdfgdfg',
      'sdfgdfgsd',
      'dfgsdfgsdf'
    );
    let paciente2 = new Paciente(
      222222,
      'dddddd',
      'ddddd',
      'dddd',
      654654,
      'ddd',
      'ddd',
      'email',
      'nacime'
    );
    this.pacientes.push(paciente);
    this.pacientes.push(paciente2);
    console.log('buscar paciente', this.pacientes);
    this.http
      .get('http://localhost:8080/example-assets/small-row-data.json')
      .subscribe(data => {
        console.log('buscar pacientes TODOS1: ', data);
      });
  }

  limpiarFiltros() {
    console.log('limpiar filtros', this.paciente);
  }

  editarPaciente(pacienteEdit:Paciente) {
    console.log('editar ', pacienteEdit);
    this.router.navigate(['paciente-form'], {
      queryParams: { nombre: pacienteEdit.nombre, paciente: pacienteEdit }
    });

  }
  /**newPaciente() {
    this.router.navigate([
      "/busqueda",
      { outlets: { detail: ["pacienteform", "1"] } }
    ]);
  }*/
}
