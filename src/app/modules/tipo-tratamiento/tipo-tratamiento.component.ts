import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoTratamientoService } from '../../core/tipo-tratamiento.service';
import { Router } from '@angular/router';

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
      (data) => { this.tratamientos = data; },
      (error) => { this.mostrarMensaje('Error al cargar tratamientos', 'error'); }
    );
  }

  guardar(): void {
    if (this.formulario.invalid) return;
    const tratamiento = this.formulario.value;

    if (this.editando && this.idEditando) {
      this.tratamientoService.actualizar(this.idEditando, tratamiento).subscribe(
        () => {
          this.mostrarMensaje('Tratamiento actualizado', 'info');
          this.obtenerTratamientos();
          this.cancelarEdicion();
        },
        () => { this.mostrarMensaje('Error al actualizar', 'error'); }
      );
    } else {
      this.tratamientoService.agregar(tratamiento).subscribe(
        () => {
          this.mostrarMensaje('Tratamiento agregado', 'info');
          this.obtenerTratamientos();
          this.formulario.reset();
        },
        () => { this.mostrarMensaje('Error al agregar', 'error'); }
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
      },
      () => { this.mostrarMensaje('Error al eliminar', 'error'); }
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
