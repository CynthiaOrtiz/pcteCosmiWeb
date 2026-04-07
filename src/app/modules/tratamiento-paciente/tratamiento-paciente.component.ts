import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../core/paciente.service';
import { Tratamiento } from '../../model/vo/tratamiento';
import { SignaturePad } from 'angular2-signaturepad';

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
    private pacienteService: PacienteService
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { citaFecha: number, citaDescripcion: string };
    
    let defaultFecha = '';
    if (state?.citaFecha) {
      const d = new Date(state.citaFecha);
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      defaultFecha = `${year}-${month}-${day}`;
    }

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
  }

  drawComplete() {
    const dataUrl = this.signaturePad.toDataURL('image/png');
    this.tratamiento.firma = dataUrl ? dataUrl.split(',')[1] : null;
  }

  guardarTratamiento(): void {
    if (this.tratamientoForm.valid) {
      const tratamiento: Tratamiento = this.tratamientoForm.value;
      tratamiento.pacienteId = this.pacienteId;
      tratamiento.firma = this.tratamiento.firma;
      this.pacienteService.agregarTratamiento(tratamiento).subscribe(() => {
        this.router.navigate(['/lista-tratamientos', this.pacienteId]);
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
