import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoTratamientoService } from '../../core/tipo-tratamiento.service';
import { TipoCatalogoService } from '../../core/tipo-catalogo.service';
import { Router } from '@angular/router';
import { NotificacionService } from '../../core/notificacion.service';

@Component({
  selector: 'app-tipo-tratamiento',
  templateUrl: './tipo-tratamiento.component.html',
  styleUrls: ['./tipo-tratamiento.component.css']
})
export class TipoTratamientoComponent implements OnInit {
  formulario!: FormGroup;
  formularioTipo!: FormGroup;
  tratamientos: any[] = [];
  tiposCatalogo: any[] = [];
  editando: boolean = false;
  idEditando: number | null = null;
  editandoTipo: boolean = false;
  idEditandoTipo: number | null = null;

  constructor(
    private fb: FormBuilder,
    private tratamientoService: TipoTratamientoService,
    private tipoCatalogoService: TipoCatalogoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private notificacion: NotificacionService,
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerTiposCatalogo();
    this.obtenerTratamientos();
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipoCatalogo: [null, Validators.required]
    });
    this.formularioTipo = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
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

  obtenerTiposCatalogo(): void {
    this.tipoCatalogoService.listar().subscribe(
      (data) => { this.tiposCatalogo = data; },
      (error) => console.error('Error al cargar tipos de catalogo', error)
    );
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.notificacion.mostrarMensaje('Todos los campos deben estar llenos.', 'error');
      return;
    }
    const formValue = this.formulario.value;
    const tratamiento = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      tipoCatalogo: this.tiposCatalogo.find(t => t.id == formValue.tipoCatalogo)
    };

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
    this.formulario.patchValue({
      nombre: tratamiento.nombre,
      descripcion: tratamiento.descripcion,
      tipoCatalogo: tratamiento.tipoCatalogo ? tratamiento.tipoCatalogo.id : null
    });
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

  guardarTipo(): void {
    if (this.formularioTipo.invalid) return;
    const tipo = this.formularioTipo.value;
    tipo.nombre = tipo.nombre.toUpperCase();

    if (this.editandoTipo && this.idEditandoTipo) {
      this.tipoCatalogoService.actualizar(this.idEditandoTipo, tipo).subscribe(() => {
        this.mostrarMensaje('Tipo actualizado', 'info');
        this.obtenerTiposCatalogo();
        this.cancelarEdicionTipo();
      });
    } else {
      this.tipoCatalogoService.agregar(tipo).subscribe(() => {
        this.mostrarMensaje('Tipo agregado', 'info');
        this.obtenerTiposCatalogo();
        this.formularioTipo.reset();
      });
    }
  }

  editarTipo(tipo: any): void {
    this.editandoTipo = true;
    this.idEditandoTipo = tipo.id;
    this.formularioTipo.patchValue(tipo);
  }

  eliminarTipo(id: number): void {
    this.tipoCatalogoService.eliminar(id).subscribe(() => {
      this.mostrarMensaje('Tipo eliminado', 'warn');
      this.obtenerTiposCatalogo();
    });
  }

  cancelarEdicionTipo(): void {
    this.editandoTipo = false;
    this.idEditandoTipo = null;
    this.formularioTipo.reset();
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
