import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  tratamientoForm: FormGroup;
  pacienteId: number = 0;
  tratamiento: Tratamiento = {
    id: 0,
    descripcion: '',
    observacion: '',
    tipoTratamiento: 0,
    fecha: '',
    antecedente: 0,
    pacienteId: 0,
    firma: null
  };
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;

  signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 500,
    'canvasHeight': 300
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService
  ) {
    this.tratamientoForm = this.fb.group({
      descripcion: ['', Validators.required],
      observacion: ['', Validators.required],
      tipoTratamiento: ['', Validators.required],
      fecha: ['', Validators.required],
      antecedente: ['']
    });
    this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
    this.tratamiento.pacienteId = this.pacienteId;
  }

  ngOnInit(): void {
  }

  drawComplete() {
    this.tratamiento.firma = this.signaturePad.toDataURL('image/png');
  }

  guardarTratamiento(): void {
    if (this.tratamientoForm.valid) {
      const tratamiento: Tratamiento = this.tratamientoForm.value;
      tratamiento.pacienteId = this.pacienteId;
      tratamiento.firma = this.tratamiento.firma;
      this.pacienteService.addTratamiento(tratamiento).subscribe(() => {
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
