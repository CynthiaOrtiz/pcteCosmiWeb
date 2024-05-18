export interface Tratamiento {
  id: number;
  descripcion: string;
  observacion: string;
  antecedente: number;
  tipo_tratamiento: number;
  zonas_tratar: string;
  fecha_tratamiento: Date;
  firma: string | null;
  pacienteId: number; // Agrega el campo pacienteId para relacionar el tratamiento con el paciente
}