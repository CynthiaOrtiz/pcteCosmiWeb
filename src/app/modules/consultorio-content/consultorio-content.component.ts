import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-consultorio-content',
  templateUrl: './consultorio-content.component.html',
  styleUrls: ['./consultorio-content.component.css']
})
export class ConsultorioContentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navegarASeccion(seccion: string): void {
    this.router.navigate([`/${seccion}`]);
  }

  verListaPacientes() {
    this.router.navigate(['/busqueda-paciente']);
}

}
