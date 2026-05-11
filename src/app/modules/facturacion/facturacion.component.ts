import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FacturacionService } from '../../core/facturacion.service';
import { PacienteService } from '../../core/paciente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paciente } from '../../model/vo/paciente';

@Component({
  standalone: false,
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {

  facturaForm!: FormGroup;
  isSubmitting: boolean = false;
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  busquedaPaciente: string = '';
  pacienteSeleccionado: Paciente | null = null;
  mostrarDropdown: boolean = false;

  readonly IVA_PORCENTAJE = 0.15;

  constructor(
    private fb: FormBuilder,
    private facturacionService: FacturacionService,
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.facturaForm = this.fb.group({
      numeroFactura: ['001-001-000000001', Validators.required],
      detalles: this.fb.array([this.crearDetalleFormGroup()])
    });
    this.cargarPacientes();
  }

  get detalles(): FormArray {
    return this.facturaForm.get('detalles') as FormArray;
  }

  crearDetalleFormGroup(): FormGroup {
    const detalle = this.fb.group({
      descripcion: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]],
      subtotal: [{ value: 0, disabled: true }]
    });

    detalle.get('cantidad')?.valueChanges.subscribe(() => this.calcularSubtotalDetalle(detalle));
    detalle.get('precioUnitario')?.valueChanges.subscribe(() => this.calcularSubtotalDetalle(detalle));

    return detalle;
  }

  calcularSubtotalDetalle(detalle: FormGroup): void {
    const cantidad = detalle.get('cantidad')?.value || 0;
    const precio = detalle.get('precioUnitario')?.value || 0;
    detalle.get('subtotal')?.setValue(cantidad * precio, { emitEvent: false });
  }

  agregarDetalle(): void {
    this.detalles.push(this.crearDetalleFormGroup());
  }

  eliminarDetalle(index: number): void {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(index);
    }
  }

  getSubtotalGeneral(): number {
    return this.detalles.controls.reduce((acc, ctrl) => {
      return acc + (ctrl.get('subtotal')?.value || 0);
    }, 0);
  }

  getIva(): number {
    return this.getSubtotalGeneral() * this.IVA_PORCENTAJE;
  }

  getTotal(): number {
    return this.getSubtotalGeneral() + this.getIva();
  }

  cargarPacientes(): void {
    this.pacienteService.getPacientes().subscribe({
      next: (data) => { this.pacientes = data; },
      error: () => { this.mostrarMensaje('No se pudo cargar la lista de pacientes', 'error'); }
    });
  }

  filtrarPacientes(): void {
    const texto = this.busquedaPaciente.toLowerCase();
    if (texto.length < 2) {
      this.pacientesFiltrados = [];
      this.mostrarDropdown = false;
      return;
    }
    this.pacientesFiltrados = this.pacientes.filter(p =>
      p.nomCom?.toLowerCase().includes(texto) || p.cedula?.includes(texto)
    );
    this.mostrarDropdown = this.pacientesFiltrados.length > 0;
  }

  seleccionarPaciente(paciente: Paciente): void {
    this.pacienteSeleccionado = paciente;
    this.busquedaPaciente = `${paciente.nomCom} - ${paciente.cedula}`;
    this.mostrarDropdown = false;
  }

  limpiarPaciente(): void {
    this.pacienteSeleccionado = null;
    this.busquedaPaciente = '';
    this.pacientesFiltrados = [];
    this.mostrarDropdown = false;
  }

  emitirFactura(): void {
    if (this.facturaForm.invalid) {
      this.mostrarMensaje('Rellene todos los campos correctamente.', 'error');
      return;
    }
    if (!this.pacienteSeleccionado) {
      this.mostrarMensaje('Seleccione un paciente antes de emitir la factura.', 'error');
      return;
    }

    this.isSubmitting = true;
    const facturaPayload = {
      numeroFactura: this.facturaForm.value.numeroFactura,
      pacienteId: this.pacienteSeleccionado.id,
      pacienteNombre: this.pacienteSeleccionado.nomCom,
      pacienteCedula: this.pacienteSeleccionado.cedula,
      detalles: this.detalles.getRawValue(),
      subtotal: this.getSubtotalGeneral(),
      iva: this.getIva(),
      total: this.getTotal(),
      fechaEmision: new Date(),
      estado: 'CREADA'
    };

    this.facturacionService.emitirFactura(facturaPayload).subscribe({
      next: (response: any) => {
        this.mostrarMensaje('Factura procesada exitosamente con el SRI', 'info');
        this.isSubmitting = false;
      },
      error: (error: any) => {
        this.mostrarMensaje('Ocurrió un error al procesar la factura con el SRI', 'error');
        this.isSubmitting = false;
        console.error(error);
      }
    });
  }

  volverAlMenu(): void {
    this.router.navigate(['/hom']);
  }

  mostrarMensaje(mensaje: string, tipo: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: tipo
    });
  }

  asFormGroup(ctrl: AbstractControl): FormGroup {
    return ctrl as FormGroup;
  }
}
