import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  constructor(private snackBar: MatSnackBar) {}

  mostrarMensaje(mensaje: string, tipo: 'info' | 'error' | 'warn' = 'info') {
    let color = 'blue-snackbar'; // Info (azul)
    if (tipo === 'error') color = 'red-snackbar';
    if (tipo === 'warn') color = 'yellow-snackbar';

    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000, // 3 segundos
      panelClass: [color],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
