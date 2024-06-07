import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef  } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CitasService } from '../../core/citas.service';
import { Paciente } from '../../model/vo/paciente';

import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, subMonths, addMonths, setMinutes, setHours } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarMonthViewDay, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
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
  newEvent: any = { title: '', patient: '', start: new Date(), hour: '' };
  selectedDay: Date | null = null;
  selectedEvents: CalendarEvent[] = [];
  isEdit: boolean = false;
  eventToEdit: CalendarEvent | null = null;
  
  paciente: Paciente = {
    identificador: 1714807766,
    nombre: 'Ceeol',
    apellido: 'orlo',
    nombre_completo: 'ceol orlo',
    cedula: '1714807766',
    direccion: 'aumaria del quito',
    telefono: 0,
    ocupacion: 'tecnology',
    genero: 'Femenenino',
    email: 'prueba@gmail.com',
    nacimiento: new Date()
  };
  constructor(private modal: NgbModal,
    private http: HttpClient,
    private citasService: CitasService
  ) {
  }

  ngOnInit(): void {
    this.loadPacientes();
    this.loadCitas();
    // this.citasService.getCitas().subscribe(citas => {
    //   this.events = citas.map(cita => ({
    //     start: startOfDay(new Date(cita.fecha)),
    //     title: cita.descripcion,
    //   }));
    //   console.log('citas2', this.events);
    // });
  }

  loadPacientes(): void {
    // Llama al servicio para cargar la lista de pacientes
    // this.citasService.getPacientes().subscribe(pacientes => {
    //   this.pacientes = pacientes;
    // });
    this.pacientes = [this.paciente];
  }

  loadCitas(): void {
    // Llama al servicio para cargar la lista de citas
    // this.citasService.getCitas().subscribe((events: CalendarEvent[]) => {
    //   this.events = events;
    //   console.log('citas', this.events);
    // });
    this.events = [];
  }

  
  dayClicked({ day }: { day: CalendarMonthViewDay }): void {
    if (isSameMonth(day.date, this.viewDate)) {
      this.selectedDay = day.date;
      this.selectedEvents = day.events;
      if (day.events.length > 0) {
        document.querySelector('.slide-in')?.classList.add('show');
      } else {
        document.querySelector('.slide-in')?.classList.remove('show');
      }
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

  viewToday(): void {
    this.viewDate = new Date();
  }

  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  saveEvent(): void {
    if (!this.selectedDay) return;

    const [hour, minute] = this.newEvent.hour.split(':').map((str: string) => parseInt(str, 10));
    const newStartDate = new Date(this.selectedDay);
    newStartDate.setHours(hour, minute);

    if (this.isEdit && this.eventToEdit) {
      this.eventToEdit.title = this.newEvent.title;
      this.eventToEdit.start = newStartDate;
      // this.citasService.updateCita(this.eventToEdit).subscribe(() => {
        this.loadCitas();
        this.modal.dismissAll();
      // });
    } else {
      const newEvent: CalendarEvent = {
        title: this.newEvent.title,
        start: newStartDate,
        color: { primary: '#e3bc08', secondary: '#FDF1BA' }
      };

      // this.citasService.agendarCita(newEvent).subscribe(() => {
        this.events = [...this.events, newEvent];
        this.modal.dismissAll();
      // });
    }
  }

  editEvent(event: CalendarEvent): void {
    this.isEdit = true;
    this.eventToEdit = event;
    this.newEvent = {
      title: event.title,
      patient: event.meta?.patient || '',
      hour: event.start.getHours().toString().padStart(2, '0') + ':' + event.start.getMinutes().toString().padStart(2, '0')
    };
    this.modal.open(this.modalContent, { size: 'lg', centered: true });
  }
  deleteEvent(event: CalendarEvent): void {
    // this.citasService.deleteCita(event).subscribe(() => {
      this.events = this.events.filter(e => e !== event);
      this.selectedEvents = this.selectedEvents.filter(e => e !== event);
    // });
  }

  openAddModal(): void {
    this.isEdit = false;
    this.newEvent = { title: '', patient: '', start: new Date(), hour: '' };
    this.modal.open(this.modalContent, { size: 'lg', centered: true });
  }
}
