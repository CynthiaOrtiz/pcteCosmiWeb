import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoTratamientoService {

  private apiUrl = 'http://localhost:8082/api/catalogo';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  agregar(tratamiento: any): Observable<any> {
    return this.http.post(this.apiUrl, tratamiento);
  }

  actualizar(id: number, tratamiento: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tratamiento);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
