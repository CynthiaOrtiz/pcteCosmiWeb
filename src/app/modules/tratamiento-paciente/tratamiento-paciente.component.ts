import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../core/paciente.service';
import { Tratamiento } from '../../model/vo/tratamiento';

@Component({
  selector: 'app-tratamiento-paciente',
  templateUrl: './tratamiento-paciente.component.html',
  styleUrls: ['./tratamiento-paciente.component.css']
})
export class TratamientoPacienteComponent implements OnInit {
  tratamientoForm: FormGroup;
  pacienteId: number = 0;

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
  }

  ngOnInit(): void {
    this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
  }

  guardarTratamiento(): void {
    if (this.tratamientoForm.valid) {
      const tratamiento: Tratamiento = this.tratamientoForm.value;
      tratamiento.pacienteId = this.pacienteId;
      this.pacienteService.addTratamiento(tratamiento).subscribe(() => {
        this.router.navigate(['/lista-tratamientos', this.pacienteId]);
      });
    }
  }
}
