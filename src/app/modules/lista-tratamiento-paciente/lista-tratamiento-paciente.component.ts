import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PacienteService } from '../../core/paciente.service';
import { Tratamiento } from '../../model/vo/tratamiento';


@Component({
  selector: 'app-lista-tratamiento-paciente',
  templateUrl: './lista-tratamiento-paciente.component.html',
  styleUrls: ['./lista-tratamiento-paciente.component.css']
})
export class ListaTratamientoPacienteComponent implements OnInit {

  tratamientos: Tratamiento[] = [];
  pacienteId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PacienteService
  ) {
  }

  ngOnInit(): void {
    this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
    this.pacienteService.getTratamientosByPacienteId(this.pacienteId).subscribe(
      (tratamientos: Tratamiento[]) => {
        this.tratamientos = tratamientos;
      }
    );
  }

}
