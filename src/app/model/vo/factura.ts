export interface FacturaDetalle {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Factura {
  id?: number;
  numeroFactura: string;
  pacienteId?: number;
  pacienteNombre?: string;
  pacienteCedula?: string;
  detalles: FacturaDetalle[];
  subtotal: number;
  iva: number;
  total: number;
  fechaEmision?: Date;
  estado?: string;
}
