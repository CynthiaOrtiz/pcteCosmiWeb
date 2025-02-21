import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoTratamientoService } from '../../core/tipo-tratamiento.service';
import { Router } from '@angular/router';
import { NotificacionService } from '../../core/notificacion.service';

@Component({
  selector: 'app-tipo-tratamiento',
  templateUrl: './tipo-tratamiento.component.html',
  styleUrls: ['./tipo-tratamiento.component.css']
})
export class TipoTratamientoComponent implements OnInit {
  formulario!: FormGroup;
  tratamientos: any[] = [];
  editando: boolean = false;
  idEditando: number | null = null;

  constructor(
    private fb: FormBuilder,
    private tratamientoService: TipoTratamientoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private notificacion: NotificacionService,
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerTratamientos();
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required]
    });
  }

  obtenerTratamientos(): void {
    this.tratamientoService.listar().subscribe(
      (data) => { this.tratamientos = data; }
      ,(error: any) => {
        console.error('Error al cargar tratamientos:', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al cargar los tratamientos', 'error');
      });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.notificacion.mostrarMensaje('Todos los campos deben estar llenos.', 'error');
      return;
    }
    let trat = this.formulario.value;
    trat.tipo = trat.tipo.toUpperCase();
    const tratamiento = trat;

    if (this.editando && this.idEditando) {
      this.tratamientoService.actualizar(this.idEditando, tratamiento).subscribe(
        () => {
          this.mostrarMensaje('Tratamiento actualizado', 'info');
          this.obtenerTratamientos();
          this.cancelarEdicion();
        },(error: any) => {
          console.error('Error al actualizar tratamiento:', error);
          this.notificacion.mostrarMensaje('Ha ocurrido un error al actualizar el tratamiento', 'error');
        }
      );
    } else {
      this.tratamientoService.agregar(tratamiento).subscribe(
        () => {
          this.mostrarMensaje('Tratamiento agregado', 'info');
          this.obtenerTratamientos();
          this.formulario.reset();
        },(error: any) => {
          console.error('Error al agregar el tratamiento:', error);
          this.notificacion.mostrarMensaje('Ha ocurrido un error al agregar el tratamiento', 'error');
        }
      );
    }
  }

  editar(tratamiento: any): void {
    this.editando = true;
    this.idEditando = tratamiento.id;
    this.formulario.patchValue(tratamiento);
  }

  eliminar(id: number): void {
    this.tratamientoService.eliminar(id).subscribe(
      () => {
        this.mostrarMensaje('Tratamiento eliminado', 'warn');
        this.obtenerTratamientos();
      },(error: any) => {
        console.error('Error al eliminar el tratamiento:', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al eliminar el tratamiento', 'error');
      }
    );
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.idEditando = null;
    this.formulario.reset();
  }

  mostrarMensaje(mensaje: string, tipo: 'info' | 'error' | 'warn'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo
    });
  }

  home() {
    this.router.navigate(['/hom']);
 }

}
