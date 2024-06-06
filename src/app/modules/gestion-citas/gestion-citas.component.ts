import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef  } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CitasService } from '../../core/citas.service';
import { Paciente } from '../../model/vo/paciente';

import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, subMonths, addMonths, setMinutes, setHours } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionCitasComponent implements OnInit {
  pacientes: Paciente[] = [];
  citas: any[] = []; // Array para almacenar las citas
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  newEvent: any = { title: '', patient: '', start: new Date(), color: { primary: '#e3bc08', secondary: '#FDF1BA' } };
  selectedDay: Date | null = null;
  selectedEvents: CalendarEvent[] = [];

  
  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  constructor(
    private http: HttpClient,
    private citasService: CitasService, private modal: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.loadPacientes();
    this.loadCitas();
    this.citasService.getCitas().subscribe(citas => {
      this.events = citas.map(cita => ({
        start: startOfDay(new Date(cita.fecha)),
        title: cita.descripcion,
      }));
    });
  }

  loadPacientes(): void {
    // Llama al servicio para cargar la lista de pacientes
    this.citasService.getPacientes().subscribe(pacientes => {
      this.pacientes = pacientes;
    });
  }

  loadCitas(): void {
    // Llama al servicio para cargar la lista de citas
    this.citasService.getCitas().subscribe((events: CalendarEvent[]) => {
      this.events = events;
    });
  }

  
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.selectedDay = date;
      this.selectedEvents = events;
      this.modal.open(this.modalContent, { size: 'lg' });
    }
  }

  addEvent(): void {
    if (!this.selectedDay) return;

    const [hour, minute] = this.newEvent.hour.split(':').map((str: string) => parseInt(str, 10));
    const newStartDate = setMinutes(setHours(this.selectedDay, hour), minute);

    const newEvent = {
      title: this.newEvent.title,
      patient: this.newEvent.patient,
      start: newStartDate,
      color: { primary: '#e3bc08', secondary: '#FDF1BA' }
    };
    console.log('guardar cita', newEvent);
    // this.citasService.agendarCita(newEvent).subscribe(() => {
      this.events = [...this.events, newEvent];
      this.modal.dismissAll();
    // });
  }

  saveEvent(event: CalendarEvent): void {
    this.http.post('/api/citas', event).subscribe(response => {
      console.log('Cita guardada:', response);
    });
  }

  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  eventClicked(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }
}
