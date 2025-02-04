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
  tratamientosFiltrados = [...this.tratamientos];
  filtroFecha: Date | null = null;
  filtroDescripcion: string = '';

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
    this.tratamientos = [{
      id:54684321,
  descripcion: 'Terapia láser',
  observacion: 'Terapia láser',
  antecedente: 4545,
  tipo_tratamiento: 4577,
  zonas_tratar: 'prueba',
  fecha_tratamiento: new Date('2024-03-01'),
  firma:null,
  pacienteId: 564546
    },
    {
      id:54684321,
  descripcion: 'Tratamiento facial',
  observacion: 'Tratamiento facial',
  antecedente: 4545,
  tipo_tratamiento: 4577,
  zonas_tratar: 'prueba',
  fecha_tratamiento: new Date('2025-02-15'),
  firma:null,
  pacienteId: 564546
    },
    {
      id:54684321,
  descripcion: 'Peeling químico',
  observacion: 'Peeling químico',
  antecedente: 4545,
  tipo_tratamiento: 4577,
  zonas_tratar: 'prueba',
  fecha_tratamiento: new Date('2025-02-10'),
  firma:null,
  pacienteId: 564546
    },
    {
      id:54684321,
  descripcion: 'Depilación láser',
  observacion: 'Depilación láser',
  antecedente: 4545,
  tipo_tratamiento: 4577,
  zonas_tratar: 'prueba',
  fecha_tratamiento: new Date('2025-02-01'),
  firma:null,
  pacienteId: 564546
    },];
    this.tratamientosFiltrados = this.tratamientos;
  }

  regresar() {
    window.history.back();
  }

  filtrarTratamientos(): void {
    this.tratamientosFiltrados = this.tratamientos.filter((tratamiento) => {
      const coincideFecha = this.filtroFecha
        ? tratamiento.fecha_tratamiento.toISOString().split('T')[0] === this.filtroFecha.toISOString().split('T')[0]
        : true;

      const coincideDescripcion = this.filtroDescripcion
        ? tratamiento.descripcion.toLowerCase().includes(this.filtroDescripcion.toLowerCase())
        : true;

      return coincideFecha && coincideDescripcion;
    });
  }
  actualizarFiltroFecha(event: string | null): void {
    this.filtroFecha = event ? new Date(event) : null;
    this.filtrarTratamientos();
  }
}
