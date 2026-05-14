import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  private apiUrl = `${environment.apiUrl}/factura`;

  constructor(private http: HttpClient) { }

  emitirFactura(facturaData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/emitir`, facturaData);
  }
}
