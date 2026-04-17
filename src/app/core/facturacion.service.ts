import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  private apiUrl = 'http://localhost:8082/adminPacServ/api/factura';

  constructor(private http: HttpClient) { }

  emitirFactura(facturaData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/emitir`, facturaData);
  }
}
