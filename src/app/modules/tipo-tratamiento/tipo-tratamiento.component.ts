import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoTratamientoService } from '../../core/tipo-tratamiento.service';
import { TipoCatalogoService } from '../../core/tipo-catalogo.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  catalogoAEliminar: any = null;
  tipoAEliminar: any = null;
  esNuevo: boolean = false;
  esNuevoTipo: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tratamientoService: TipoTratamientoService,
    private tipoCatalogoService: TipoCatalogoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private notificacion: NotificacionService,
    private modalService: NgbModal
  ) { }

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
      , (error: any) => {
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
        }, (error: any) => {
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
          this.esNuevo = false;
        }, (error: any) => {
          console.error('Error al agregar el tratamiento:', error);
          this.notificacion.mostrarMensaje('Ha ocurrido un error al agregar el tratamiento', 'error');
        }
      );
    }
  }

  editar(tratamiento: any): void {
    this.editando = true;
    this.esNuevo = true;
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
        this.notificacion.mostrarMensaje('Catálogo eliminado correctamente', 'info');
        this.catalogoAEliminar = null;
        this.obtenerTratamientos();
      }, (error: any) => {
        console.error('Error al eliminar el tratamiento:', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al eliminar el catálogo', 'error');
      }
    );
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.esNuevo = false;
    this.idEditando = null;
    this.formulario.reset();
  }

  guardarTipo(): void {
    if (this.formularioTipo.invalid) return;
    const tipo = this.formularioTipo.value;
    tipo.nombre = tipo.nombre.toUpperCase();

    if (this.editandoTipo && this.idEditandoTipo) {
      this.tipoCatalogoService.actualizar(this.idEditandoTipo, tipo).subscribe(() => {
        this.notificacion.mostrarMensaje('Tipo actualizado correctamente', 'info');
        this.obtenerTiposCatalogo();
        this.cancelarEdicionTipo();
      }, (error: any) => {
        console.error('Error al actualizar tipo de catalogo:', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al actualizar el Tipo', 'error');
      });
    } else {
      this.tipoCatalogoService.agregar(tipo).subscribe(() => {
        this.notificacion.mostrarMensaje('Tipo agregado correctamente', 'info');
        this.obtenerTiposCatalogo();
        this.formularioTipo.reset();
        this.esNuevoTipo = false;
      }, (error: any) => {
        console.error('Error al agregar el tipo:', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al agregar el Tipo', 'error');
      });
    }
  }

  editarTipo(tipo: any): void {
    this.editandoTipo = true;
    this.esNuevoTipo = true;
    this.idEditandoTipo = tipo.id;
    this.formularioTipo.patchValue(tipo);
  }

  abrirModalEliminarCatalogo(catalogo: any, modalContent: any): void {
    this.catalogoAEliminar = catalogo;
    this.modalService.open(modalContent, { centered: true }).result.then(
      (result) => {
        if (result === 'Ok') {
          this.eliminar(catalogo.id);
        }
      },
      (reason) => {
        this.catalogoAEliminar = null;
      }
    );
  }

  abrirModalEliminarTipo(tipo: any, modalContent: any): void {
    this.tipoAEliminar = tipo;
    this.modalService.open(modalContent, { centered: true }).result.then(
      (result) => {
        if (result === 'Ok') {
          this.eliminarTipo(tipo.id);
        }
      },
      (reason) => {
        this.tipoAEliminar = null;
      }
    );
  }

  eliminarTipo(id: number): void {
    this.tipoCatalogoService.eliminar(id).subscribe(() => {
      this.notificacion.mostrarMensaje('Tipo eliminado correctamente', 'info');
      this.tipoAEliminar = null;
      this.obtenerTiposCatalogo();
    }, (error: any) => {
      console.error('Error al eliminar tipo:', error);
      this.notificacion.mostrarMensaje('Ha ocurrido un error al eliminar el Tipo', 'error');
    });
  }

  cancelarEdicionTipo(): void {
    this.editandoTipo = false;
    this.esNuevoTipo = false;
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

  nuevo() {
    if (this.esNuevo) {
      this.esNuevo = false;
    } else {
      this.esNuevo = true;
    }
  }

  nuevoTipo() {
    if (this.esNuevoTipo) {
      this.esNuevoTipo = false;
      this.cancelarEdicionTipo();
    } else {
      this.esNuevoTipo = true;
    }
  }

}
