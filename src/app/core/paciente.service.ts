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
  private apiUrl = 'http://localhost:8082/adminPacServ/api/adminpaciente';
  private tratamientosUrl = 'http://localhost:8082/adminPacServ/api/tratamientos'; // URL para tratamientos
  private historia = 'http://localhost:8082/adminPacServ/api/historia'; // URL para tratamientos

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

  getHistoriasClinicas(pacienteId: number): Observable<HistoriaClinica[]> {
    return this.http.get<any[]>(`${this.historia}/historias-clinicas?pacienteId=${pacienteId}` );
  }

  getHistoriaClinicaById(historiaId: number): Observable<any>{
    return this.http.post(`${this.historia}/getHistoriaClinica`, historiaId);
  }

  guardarHistoriaClinica(historiaClinica: HistoriaClinica): Observable<any> {
    return this.http.post(`${this.historia}/guardarHistoria`, historiaClinica);
  }

  updateHistoriaById(historiaClinica: HistoriaClinica): Observable<any> {
    return this.http.post(`${this.historia}/updateHistoriaById`, historiaClinica);
  }

  agregarTratamiento(tratamiento: Tratamiento): Observable<any> {
    return this.http.post(`${this.tratamientosUrl}/agregarTratamiento`, tratamiento);
  }

  // Métodos para tratamientos
  getTratamientosByPacienteId(pacienteId: number): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(`${this.tratamientosUrl}/getTratamientosByPacienteId?pacienteId=${pacienteId}`);
  }

}
