import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacturacionService } from '../../core/facturacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {

  facturaForm!: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private facturacionService: FacturacionService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.facturaForm = this.fb.group({
      numeroFactura: ['001-001-000000001', Validators.required],
      subtotal: [0, [Validators.required, Validators.min(0)]],
      iva: [0, [Validators.required, Validators.min(0)]],
      total: [0, [Validators.required, Validators.min(0)]]
    });
  }

  emitirFactura() {
    if (this.facturaForm.invalid) {
      this.mostrarMensaje('Rellene todos los campos correctamente.', 'error');
      return;
    }

    this.isSubmitting = true;
    const facturaPayload = {
      numeroFactura: this.facturaForm.value.numeroFactura,
      subtotal: this.facturaForm.value.subtotal,
      iva: this.facturaForm.value.iva,
      total: this.facturaForm.value.total,
      fechaEmision: new Date(),
      estado: 'CREADA'
      // El paciente debe vincularse dinámicamente según el flujo
    };

    this.facturacionService.emitirFactura(facturaPayload).subscribe(
      (response: any) => {
        this.mostrarMensaje('Factura procesada con el SRI', 'info');
        this.isSubmitting = false;
        console.log(response);
      },
      (error: any) => {
        this.mostrarMensaje('Ocurrió un error con el SRI', 'error');
        this.isSubmitting = false;
        console.error(error);
      }
    );
  }

  mostrarMensaje(mensaje: string, tipo: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: tipo
    });
  }
}
