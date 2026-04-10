import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../core/paciente.service';
import { Tratamiento } from '../../model/vo/tratamiento';
import { SignaturePad } from 'angular2-signaturepad';
import { TipoTratamientoService } from '../../core/tipo-tratamiento.service';
import { NotificacionService } from '../../core/notificacion.service';

@Component({
  selector: 'app-tratamiento-paciente',
  templateUrl: './tratamiento-paciente.component.html',
  styleUrls: ['./tratamiento-paciente.component.css']
})
export class TratamientoPacienteComponent implements OnInit {

  tratamientoForm: UntypedFormGroup;
  pacienteId: number = 0;
  tratamiento: Tratamiento = {
    id: 0,
    descripcion: '',
    observacion: '',
    tipo_tratamiento: 0,
    fecha_tratamiento: new Date,
    antecedente: 0,
    pacienteId: 0,
    zonas_tratar: '',
    firma: null
  };
  catalogos: any[] = [];
  catalogosFormularios: any[] = [];
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;

  signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 800,
    'canvasHeight': 300
  };

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private tipoTratamientoService: TipoTratamientoService,
    private notificacion: NotificacionService
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { citaFecha: number, citaDescripcion: string };

    let d = state?.citaFecha ? new Date(state.citaFecha) : new Date();
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    let defaultFecha = `${year}-${month}-${day}`;

    const defaultDesc = state?.citaDescripcion || '';

    this.tratamientoForm = this.fb.group({
      descripcion: [defaultDesc, Validators.required],
      observacion: ['', Validators.required],
      tipo_tratamiento: ['', Validators.required],
      zonas_tratar: [''],
      fecha_tratamiento: [defaultFecha, Validators.required],
      antecedente: ['']
    });
    this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
    this.tratamiento.pacienteId = this.pacienteId;
  }

  ngOnInit(): void {
    this.tipoTratamientoService.listar().subscribe(catalogos => {
      this.catalogos = catalogos.filter((c: any) => c.tipoCatalogo && c.tipoCatalogo.nombre === 'TRATAMIENTOS');
      this.catalogosFormularios = catalogos.filter((c: any) => c.tipoCatalogo && c.tipoCatalogo.nombre === 'FORMULARIO');
    });
  }

  drawComplete() {
    const dataUrl = this.signaturePad.toDataURL('image/png');
    this.tratamiento.firma = dataUrl ? dataUrl.split(',')[1] : null;
  }

  guardarTratamiento(): void {
    if (this.tratamientoForm.valid) {
      if (this.signaturePad && !this.signaturePad.isEmpty()) {
        const dataUrl = this.signaturePad.toDataURL('image/png');
        this.tratamiento.firma = dataUrl ? dataUrl.split(',')[1] : null;
      } else {
        this.tratamiento.firma = null;
      }

      const tratamientoFor: Tratamiento = this.tratamientoForm.value;
      tratamientoFor.pacienteId = this.pacienteId;
      tratamientoFor.firma = this.tratamiento.firma;
      this.pacienteService.agregarTratamiento(tratamientoFor).subscribe(response => {
        this.notificacion.mostrarMensaje('El tratamiento se ha guardado exitosamente.', 'info');
        window.history.back();
      }, (error: any) => {
        console.error('Error al guardar el tratamiento:', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al guardar el tratamiento', 'error');
      });
    }
  }

  regresar() {
    window.history.back();
  }

  clearSignature(): void {
    this.signaturePad.clear();
  }

}
