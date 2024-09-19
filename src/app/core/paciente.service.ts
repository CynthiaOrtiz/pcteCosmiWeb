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
  private apiUrl = 'http://localhost:8082/api/adminpaciente';
  private tratamientosUrl = 'http://localhost:8082/api/tratamientos'; // URL para tratamientos
  private historia = 'http://localhost:8082/api/historia'; // URL para tratamientos
  
  constructor(private http: HttpClient) { }

  guardarPaciente(paciente: Paciente): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardarPaciente`, paciente);
  }
  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/buscarPacientes`);
  }

  getPacienteById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/getPaciente/${id}`);
  }

  updatePaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/updatePaciente`, paciente);
  }

  deletePaciente(paciente: Paciente): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/deletePaciente`, paciente);
  }

  guardarHistoriaClinica(historiaClinica: HistoriaClinica): Observable<any> {
    return this.http.post(`${this.historia}/guardarHistoria`, historiaClinica);
  }

  agregarTratamiento(tratamiento: Tratamiento): Observable<any> {
    return this.http.post(`${this.tratamientosUrl}/tratamientos`, tratamiento);
  }

  // Métodos para tratamientos
  getTratamientosByPacienteId(pacienteId: number): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(`${this.tratamientosUrl}?pacienteId=${pacienteId}`);
  }

  addTratamiento(tratamiento: Tratamiento): Observable<Tratamiento> {
    return this.http.post<Tratamiento>(this.tratamientosUrl, tratamiento);
  }

}
