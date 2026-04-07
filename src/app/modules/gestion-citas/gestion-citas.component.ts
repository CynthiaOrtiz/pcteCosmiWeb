import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
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
  newEvent: any = { title: '', patient: '', start: new Date(), hour: '00:00', status: 'active' };
  selectedDay: Date | null = null;
  selectedEvents: CalendarEvent[] = [];
  isEdit: boolean = false;
  eventToEdit: any | null = null;
  isSaving: boolean = false;

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
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth() + 1;
    this.citasService.getCitas(year, month).subscribe((citas: any[]) => {
      this.events = citas.map((cita: any) => {
        const startDate = new Date(cita.hora);
        const horaStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const pacienteNombre = cita.paciente ? cita.paciente.nombre : 'Sin paciente';
        return {
          start: startDate,
          title: `${horaStr} - ${cita.descripcion} - ${pacienteNombre}`,
          meta: {
            title: cita.descripcion,
            citaId: cita.id,
            patient: cita.paciente || null,
            status: cita.estado
          },
          color: (cita.estado === 0 || cita.estado === '0' || cita.estado === 'cancelled')
            ? { primary: '#ad2121', secondary: '#FAE3E3' }
            : { primary: '#008000', secondary: '#ccffcc' }
        };
      });
      console.log('citas mapeadas', this.events);
      this.refresh.next(null);
      if (this.selectedDay) {
        this.selectedEvents = this.events.filter(event =>
          event.start.getDate() === (this.selectedDay as Date).getDate() &&
          event.start.getMonth() === (this.selectedDay as Date).getMonth() &&
          event.start.getFullYear() === (this.selectedDay as Date).getFullYear()
        ).sort((a, b) => a.start.getTime() - b.start.getTime());
      }
    }, error => {
      console.error('Error al obtener las citas:', error);
      this.notificacion.mostrarMensaje('Ha ocurrido un error al obtener las citas', 'error');
    });
    this.events = [];
  }


  dayClicked({ day }: { day: CalendarMonthViewDay }): void {
    if (day.date.getMonth() === this.viewDate.getMonth() && day.date.getFullYear() === this.viewDate.getFullYear()) {
      this.selectedDay = day.date;
      this.selectedEvents = [...day.events].sort((a, b) => a.start.getTime() - b.start.getTime());
      document.querySelector('.slide-in')?.classList.add('show');
      this.activeDayIsOpen = true;
    }
  }

  addEvent(): void {
    if (!this.selectedDay) return;

    if (!this.newEvent.patient) {
      this.notificacion.mostrarMensaje('Se debe elegir un paciente para continuar y guardar la cita', 'error');
      return;
    }

    const [hour, minute] = this.newEvent.hour.split(':').map((str: string) => parseInt(str, 10));
    const newStartDate = setMinutes(setHours(this.selectedDay, hour), minute);

    const newEvent = {
      title: this.newEvent.title,
      patient: this.newEvent.patient,
      start: newStartDate,
      color: (this.newEvent.status === 'cancelled' || this.newEvent.status === '0' || this.newEvent.status === 0)
        ? { primary: '#ad2121', secondary: '#FAE3E3' }
        : { primary: '#008000', secondary: '#ccffcc' }
    };

    // Mapeo correcto para el backend
    const citaBackend = {
      idPaciente: this.newEvent.patient.id,
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
    this.loadCitas();
  }

  previousMonth(): void {
    this.viewDate = this.changePeriod(-1);
    this.loadCitas();
  }

  nextMonth(): void {
    this.viewDate = this.changePeriod(1);
    this.loadCitas();
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
    if (this.isSaving) return;

    const [hour, minute] = this.newEvent.hour.split(':').map((str: string) => parseInt(str, 10));
    const newStartDate = new Date(this.selectedDay);
    newStartDate.setHours(hour, minute, 0, 0);

    if (!this.newEvent.patient) {
      this.notificacion.mostrarMensaje('Se debe elegir un paciente para continuar y guardar la cita', 'error');
      return;
    }

    if (!this.isEdit) {
      const isOverlapping = this.events.some(event => {
        if (event.meta?.status === 0 || event.meta?.status === 'cancelled' || event.meta?.status === '0') {
          return false;
        }
        const timeDiff = Math.abs(newStartDate.getTime() - event.start.getTime());
        const diffInMinutes = timeDiff / (1000 * 60);
        return diffInMinutes < 15;
      });

      if (isOverlapping) {
        this.isSaving = false;
        this.notificacion.mostrarMensaje('El horario ya está ocupado con otra cita', 'error');
        return;
      }
    }

    this.isSaving = true;

    if (this.isEdit && this.eventToEdit) {
      this.eventToEdit.title = this.newEvent.title;
      this.eventToEdit.start = newStartDate;

      const citaActualizar = {
        id: this.eventToEdit.meta?.citaId || this.eventToEdit.id,
        idPaciente: this.newEvent.patient,
        fecha: newStartDate.getTime(),
        hora: newStartDate.getTime(),
        estado: this.newEvent.status === 'active' || this.newEvent.status === '1' || this.newEvent.status === 1 ? 1 : 0,
        descripcion: this.newEvent.title
      };

      this.citasService.updateCita(citaActualizar).subscribe(() => {
        this.isSaving = false;
        this.loadCitas();
        this.modal.dismissAll();
        this.notificacion.mostrarMensaje('Cita actualizada', 'info');
      }, (error: any) => {
        this.isSaving = false;
        console.error('Error al actualizar la cita:', error);
        this.notificacion.mostrarMensaje('Ha ocurrido un error al actualizar la cita', 'error');
      });
    } else {
      // Validate that the new event is not in the past
      if (newStartDate < new Date()) {
        this.isSaving = false;
        this.notificacion.mostrarMensaje('No se puede agendar una cita en el pasado.', 'error');
        return;
      }
      const newEvent: CalendarEvent = {
        title: this.newEvent.title,
        start: newStartDate,
        color: (this.newEvent.status === 'cancelled' || this.newEvent.status === '0' || this.newEvent.status === 0)
          ? { primary: '#ad2121', secondary: '#FAE3E3' }
          : { primary: '#008000', secondary: '#ccffcc' }
      };

      const citaBackend = {
        idPaciente: this.newEvent.patient,
        fecha: newStartDate.getTime(),
        hora: newStartDate.getTime(),
        estado: this.newEvent.status === 'active' || this.newEvent.status === '1' || this.newEvent.status === 1 ? 1 : 0,
        descripcion: this.newEvent.title
      };

      this.citasService.agendarCita(citaBackend).subscribe(() => {
        this.isSaving = false;
        this.events = [...this.events, newEvent];
        this.loadCitas();
        this.modal.dismissAll();
        this.notificacion.mostrarMensaje('Cita agendada', 'info');
      }, (error: any) => {
        this.isSaving = false;
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
      title: event.meta?.title || event.title,
      patient: event.meta?.patient?.id || event.meta?.patient || '',
      status: event.meta?.status === 1 ? 'active' : 'cancelled',
      hour: event.start.getHours().toString().padStart(2, '0') + ':' + event.start.getMinutes().toString().padStart(2, '0')
    };
    this.modal.open(this.modalContent, { size: 'sm', centered: true, backdrop: 'static', keyboard: false });
  }
  deleteEvent(event: CalendarEvent): void {
    this.citasService.deleteCita(event.meta.citaId).subscribe(() => {
      this.loadCitas();
      this.notificacion.mostrarMensaje('Cita eliminada', 'info');
    }, (error: any) => {
      console.error('Error al borrar la cita:', error);
      this.notificacion.mostrarMensaje('Ha ocurrido un error al borrar la cita', 'error');
    });
  }

  openAddModal(): void {
    if (!this.selectedDay) return;
    const newStartDate = new Date(this.selectedDay)
    newStartDate.setHours(23, 99);
    if (newStartDate < new Date()) {
      alert('No se puede agendar una cita en el pasado.');
      return;
    }
    this.isEdit = false;
    this.newEvent = { title: '', patient: '', start: new Date(), hour: '00:00', status: 'active' };
    this.modal.open(this.modalContent, { size: 'sm', centered: true, backdrop: 'static', keyboard: false });
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
