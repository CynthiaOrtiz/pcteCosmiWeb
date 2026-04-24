import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../model/vo/paciente';
import { Cita } from '../model/vo/cita';
import { CalendarEvent } from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private apiUrl = 'http://localhost:8082/adminPacServ/api/citas'; // URL del servicio web
  private apiUrlPaciente = 'http://localhost:8082/adminPacServ/api/adminpaciente';

  constructor(private http: HttpClient) { }

  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrlPaciente}/buscarPacientes`);
  }

  getCitas(year: number, month: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/citas/${year}/${month}`);
  }

  agendarCita(cita: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/agendarCita`, cita);
  }
  updateCita(cita: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/actualizarCita`, cita);
  }

  deleteCita(citaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/borrarCita/${citaId}`, null);
  }
}
