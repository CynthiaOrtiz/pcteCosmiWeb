import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef  } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CitasService } from '../../core/citas.service';
import { Paciente } from '../../model/vo/paciente';
import { Router } from '@angular/router';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, subMonths, addMonths, setMinutes, setHours } from 'date-fns';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarMonthViewDay, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { NotificacionService } from '../../core/notificacion.service';

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
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  newEvent: any = { title: '', patient: '', start: new Date(), hour: '' };
  selectedDay: Date | null = null;
  selectedEvents: CalendarEvent[] = [];
  isEdit: boolean = false;
  eventToEdit: any | null = null;

  paciente: Paciente = {
    id: 1714807766,
    nombre: 'Ceeol',
    apellido: 'orlo',
    nomCom: 'ceol orlo',
    cedula: '1714807766',
    direccion: 'aumaria del quito',
    telefono: 0,
    ocupacion: 'tecnology',
    genero: 'Femenenino',
    email: 'prueba@gmail.com',
    nacimiento: new Date()
  };

  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;

  constructor(protected modal: NgbModal,
    private http: HttpClient,
    private citasService: CitasService,
    private router: Router,
    private notificacion: NotificacionService,
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
     this.citasService.getPacientes().subscribe(pacientes => {
       this.pacientes = pacientes;
     }, (error: any) => {
      console.error('Error al obtener los pacientes:', error);
      this.notificacion.mostrarMensaje('Ha ocurrido un error al obtener los pacientes', 'error');
    });
    this.pacientes = [this.paciente];
  }

  loadCitas(): void {
    // Llama al servicio para cargar la lista de citas
     this.citasService.getCitas().subscribe((events: CalendarEvent[]) => {
       this.events = events;
       console.log('citas', this.events);
     }, error => {
      console.error('Error al obtener las citas:', error);
      this.notificacion.mostrarMensaje('Ha ocurrido un error al obtener las citas', 'error');
    });
    this.events = [];
  }


  dayClicked({ day }: { day: CalendarMonthViewDay }): void {
    if (isSameMonth(day.date, this.viewDate)) {
      this.selectedDay = day.date;
      this.selectedEvents = day.events;
       if (
        (isSameDay(this.viewDate, this.selectedDay) && this.activeDayIsOpen === true) ||
        day.events.length > 0) {
        document.querySelector('.slide-in')?.classList.add('show');
         this.activeDayIsOpen = true;
      } else {
        document.querySelector('.slide-in')?.classList.remove('show');
         this.activeDayIsOpen = false;
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
    
    // Mapeo correcto para el backend
    const citaBackend = {
      idPaciente: this.newEvent.patient ? (this.newEvent.patient.identificador || this.newEvent.patient.id || 1714807766) : 1714807766,
      fecha: newStartDate.getTime(),
      hora: newStartDate.getTime(),
      estado: 1,
      descripcion: this.newEvent.title
    };
    
    console.log('guardar cita', citaBackend);
     this.citasService.agendarCita(citaBackend).subscribe(() => {
      this.events = [...this.events, newEvent];
      this.modal.dismissAll();
     }, (error: any) => {
      console.error('Error al agendar las citas:', error);
      this.notificacion.mostrarMensaje('Ha ocurrido un error al agendar la cita', 'error');
    });
    document.querySelector('.slide-in')?.classList.add('show');
  }

  viewToday(): void {
    this.viewDate = new Date();
  }

  previousMonth(): void {
    this.viewDate = this.changePeriod(-1);
  }

  nextMonth(): void {
    this.viewDate = this.changePeriod(1);
  }
  changePeriod(amount: number): Date {
    if (this.view === CalendarView.Month) {
      return addMonths(this.viewDate, amount);
    } else if (this.view === CalendarView.Week) {
      return addMonths(this.viewDate, amount);
    } else {
      return addMonths(this.viewDate, amount);
    }
  }

  saveEvent(): void {
    if (!this.selectedDay) return;

    const [hour, minute] = this.newEvent.hour.split(':').map((str: string) => parseInt(str, 10));
    const newStartDate = new Date(this.selectedDay);
    newStartDate.setHours(hour, minute);

    // Validate that the new event is not in the past
    if (newStartDate < new Date()) {
      alert('No se puede agendar una cita en el pasado.');
      return;
    }

    if (this.isEdit && this.eventToEdit) {
      this.eventToEdit.title = this.newEvent.title;
      this.eventToEdit.start = newStartDate;
      
      const citaActualizar = {
        id: this.eventToEdit.meta?.citaId || this.eventToEdit.id,
        idPaciente: this.newEvent.patient ? (this.newEvent.patient.identificador || this.newEvent.patient.id || 1714807766) : 1714807766,
        fecha: newStartDate.getTime(),
        hora: newStartDate.getTime(),
        estado: 1,
        descripcion: this.newEvent.title
      };
      
      this.citasService.updateCita(citaActualizar).subscribe(() => {
         this.loadCitas();
        this.modal.dismissAll();
       }, (error: any) => {
        console.error('Error al actualizar la cita:', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al actualizar la cita', 'error');
      });
    } else {
      const newEvent: CalendarEvent = {
        title: this.newEvent.title,
        start: newStartDate,
        color: { primary: '#e3bc08', secondary: '#FDF1BA' }
      };

      const citaBackend = {
        idPaciente: this.newEvent.patient ? (this.newEvent.patient.identificador || this.newEvent.patient.id || 1714807766) : 1714807766,
        fecha: newStartDate.getTime(),
        hora: newStartDate.getTime(),
        estado: 1,
        descripcion: this.newEvent.title
      };

       this.citasService.agendarCita(citaBackend).subscribe(() => {
        this.events = [...this.events, newEvent];
         this.loadCitas();
        this.modal.dismissAll();
       }, (error: any) => {
        console.error('Error al agendar la cita:', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al actualizar las citas', 'error');
      });
    }
    document.querySelector('.slide-in')?.classList.add('show');
  }

  editEvent(event: CalendarEvent): void {
    this.isEdit = true;
    this.eventToEdit = event;
    this.newEvent = {
      title: event.title,
      patient: event.meta?.patient || '',
      hour: event.start.getHours().toString().padStart(2, '0') + ':' + event.start.getMinutes().toString().padStart(2, '0')
    };
    this.modal.open(this.modalContent, { size: 'sm', centered: true });
  }
  deleteEvent(event: CalendarEvent): void {
     this.citasService.deleteCita(event).subscribe(() => {
      this.events = this.events.filter(e => e !== event);
      this.selectedEvents = this.selectedEvents.filter(e => e !== event);
     }, (error: any) => {
      console.error('Error al borrar la cita:', error);
      this.notificacion.mostrarMensaje('Ha ocurrido un error al borrar la cita', 'error');
    });
  }

  openAddModal(): void {
    if(!this.selectedDay) return;
    const newStartDate = new Date(this.selectedDay)
    newStartDate.setHours(23, 99);
    if (newStartDate < new Date()) {
      alert('No se puede agendar una cita en el pasado.');
      return;
    }
    this.isEdit = false;
    this.newEvent = { title: '', patient: '', start: new Date(), hour: '' };
    this.modal.open(this.modalContent, { size: 'sm', centered: true });
  }
  registerTreatment(event: CalendarEvent): void {
    this.eventToEdit = event;
    this.router.navigate(['/tratamiento-paciente', event.meta?.patient.identificador]);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  home() {
    this.router.navigate(['/hom']);
    }
}
