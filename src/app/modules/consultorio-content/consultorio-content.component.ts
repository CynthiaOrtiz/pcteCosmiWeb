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

  navigate(route: string) {
    this.router.navigate([route]);
}

nuevoPaciente() {
  this.router.navigate(['/registro-paciente']);
}

catalogos() {
  this.router.navigate(['/catalogos']);
  }
}
