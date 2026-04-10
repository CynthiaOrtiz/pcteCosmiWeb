import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoCatalogoService {

  private apiUrl = 'http://localhost:8082/adminPacServ/api/tipocatalogo';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  agregar(tipoCatalogo: any): Observable<any> {
    return this.http.post(this.apiUrl, tipoCatalogo);
  }

  actualizar(id: number, tipoCatalogo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tipoCatalogo);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
