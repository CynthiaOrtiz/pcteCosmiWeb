import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HistoriaClinica } from '../model/vo/historiaClinica';
import { Tratamiento } from '../model/vo/tratamiento';
import { Paciente } from '../model/vo/paciente';


@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:8080/api/pacientes';
  private tratamientosUrl = 'http://tu-api-url/api/tratamientos'; // URL para tratamientos
  
  constructor(private http: HttpClient) { }

  guardarPaciente(paciente: Paciente): Observable<any> {
    return this.http.post(`${this.apiUrl}/paciente`, paciente);
  }
  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }

  getPacienteById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  addPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, paciente);
  }

  updatePaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/${paciente.identificador}`, paciente);
  }

  deletePaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  guardarHistoriaClinica(historiaClinica: HistoriaClinica): Observable<any> {
    return this.http.post(`${this.apiUrl}/historias-clinicas`, historiaClinica);
  }

  agregarTratamiento(tratamiento: Tratamiento): Observable<any> {
    return this.http.post(`${this.apiUrl}/tratamientos`, tratamiento);
  }

  // Métodos para tratamientos
  getTratamientosByPacienteId(pacienteId: number): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(`${this.tratamientosUrl}?pacienteId=${pacienteId}`);
  }

  addTratamiento(tratamiento: Tratamiento): Observable<Tratamiento> {
    return this.http.post<Tratamiento>(this.tratamientosUrl, tratamiento);
  }

}
