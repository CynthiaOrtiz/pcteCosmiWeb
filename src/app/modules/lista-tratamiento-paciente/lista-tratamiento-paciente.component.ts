import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PacienteService } from '../../core/paciente.service';
import { Tratamiento } from '../../model/vo/tratamiento';
import { NotificacionService } from '../../core/notificacion.service';
import { TipoTratamientoService } from '../../core/tipo-tratamiento.service';

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
    private pacienteService: PacienteService,
    private notificacion: NotificacionService,
    private tipoTratamientoService: TipoTratamientoService
  ) {
  }

  catalogoMap = new Map<number, string>();

  ngOnInit(): void {
    this.tipoTratamientoService.listar().subscribe(catalogos => {
      catalogos.forEach((c: any) => this.catalogoMap.set(c.id, c.nombre));
    });

    this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
    this.pacienteService.getTratamientosByPacienteId(this.pacienteId).subscribe(
      (tratamientos: Tratamiento[]) => {
        this.tratamientos = tratamientos;
        this.tratamientosFiltrados = [...this.tratamientos];
      }, (error: any) => {
        console.error('Error al cargar los tratamientos del paciente', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al cargar los tratamientos del paciente', 'error');
      });
  }

  regresar() {
    window.history.back();
  }

  filtrarTratamientos(): void {
    this.tratamientosFiltrados = this.tratamientos.filter((tratamiento) => {
      const fechaObj = new Date(tratamiento.fecha_tratamiento);
      const coincideFecha = this.filtroFecha
        ? fechaObj.toISOString().split('T')[0] === this.filtroFecha.toISOString().split('T')[0]
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
